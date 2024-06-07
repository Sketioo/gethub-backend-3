const models = require('../models');
const { formatDates } = require('../helpers/utility');
const { Op, literal } = require('sequelize');
const { getUserId } = require("../helpers/utility");
const {
  getOwnerIdByChatRoomId, getFreelancerIdByChatRoomId,
  getStartDateByChatRoomId, getProjectIdByChatRoomId
} = require("../helpers/digital-contract");
const cron = require('node-cron');
const { differenceInDays, addDays } = require('date-fns');


const getUserJobStatsAndBids = async (req, res) => {
  try {
    const { user_id } = getUserId(req);

    const jobPostedCount = await models.Project.count({
      where: { owner_id: user_id }
    });

    const bidsMadeCount = await models.Project_User_Bid.count({
      where: { user_id: user_id }
    });

    const bidsAcceptedCount = await models.Project_User_Bid.count({
      where: {
        user_id: user_id,
        is_selected: true
      }
    });

    const bids = await models.Project_User_Bid.findAll({
      where: {
        user_id: user_id,
        is_selected: false
      },
      include: [
        {
          model: models.Project,
          as: 'project',
          include: [
            {
              model: models.User,
              as: 'owner_project',
              attributes: ['id', 'full_name', 'username', 'email', 'photo', 'profession']
            },
            {
              model: models.Project_User_Bid,
              as: 'users_bid',
              attributes: ['id']
            }
          ]
        }
      ]
    });

    if (!bids) {
      return res.status(404).json({
        success: false,
        message: "Informasi job bidding dan daftar proyek yang dibid tidak ditemukan",
        data: [],
        error_code: 404
      });
    }

    const bidProjects = bids.map(bid => {
      const projectData = {
        projectId: bid.project.id,
        title: bid.project.title,
        description: bid.project.description,
        owner: {
          id: bid.project.owner_project.id,
          full_name: bid.project.owner_project.full_name,
          username: bid.project.owner_project.username,
          email: bid.project.owner_project.email,
          photo: bid.project.owner_project.photo,
          profession: bid.project.owner_project.profession
        },
        min_budget: bid.project.min_budget,
        max_budget: bid.project.max_budget,
        min_deadline: bid.project.min_deadline,
        max_deadline: bid.project.max_deadline,
        created_date: bid.project.created_date,
        is_selected: bid.is_selected,
        total_bids: bid.project.users_bid.length
      };

      const formattedProjectData = formatDates(projectData, ['min_deadline', 'max_deadline', 'created_date']);
      const daysDifference = differenceInDays(new Date(bid.project.max_deadline), new Date(bid.project.min_deadline));
      formattedProjectData.deadline_duration = `${daysDifference}d`;

      return formattedProjectData;
    });

    return res.status(200).json({
      success: true,
      data: {
        job_posted: jobPostedCount,
        bids_made: bidsMadeCount,
        bids_accepted: bidsAcceptedCount,
        bid_projects: bidProjects
      },
      message: "Informasi job bidding dan daftar proyek yang dibid berhasil diambil",
      error_code: 0
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil informasi job bidding dan daftar proyek yang dibid:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500
    });
  }
};



const postProject = async (req, res) => {
  try {
    const { user_id } = getUserId(req);
    const checkOwner = await models.User.findByPk(user_id, {
      where: [{ include: models.Category, as: 'category', attributes: ['name'] }]
    });

    if (!checkOwner) {
      return res.status(404).json({
        success: false,
        message: "Pemilik tidak ditemukan",
        error_code: 404,
      });
    }

    const project = await models.Project.create({ ...req.body, owner_id: user_id });
    project.is_active = true;

    const job = cron.schedule('0 0 * * *', async () => {
      try {
        const daysRemaining = differenceInDays(project.deadline, new Date());
        if (daysRemaining > 0) {
          const newDeadline = addDays(project.deadline, -1);
          project.deadline = newDeadline;
          await project.save();
          console.log(`Updated deadline for project ${project.id}`);
        } else {
          job.stop();
        }
      } catch (error) {
        console.error('Error updating deadline:', error);
      }
    });

    await project.save();

    const formattedProject = formatDates(project.toJSON(), ['min_deadline', 'max_deadline', 'created_date']);

    return res.status(201).json({
      success: true,
      data: formattedProject,
      message: "Proyek berhasil diposting",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat memposting proyek:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const getAllTask = async (req, res) => {
  try {
    const tasks = await models.Project_Task.findAll({
      where: { project_id: req.params.id }
    });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: 'Tidak ada tugas yang ditemukan',
        error_code: 404
      })
    }

    res.status(200).json({
      success: true,
      data: tasks,
      message: 'Semua tugas berhasil diambil',
      error_code: 0
    })
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error_code: 500
    })
  }
}

const postTask = async (req, res) => {
  const { task_number, task_description, task_status, task_feedback } = req.body;
  const { id } = req.params;

  const { user_id } = getUserId(req);

  try {
    const project = await models.Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyek tidak ditemukan',
        error_code: 404
      });
    }

    if (project.status_freelance_task === 'CLOSE') {
      return res.status(403).json({
        success: false,
        message: 'Proyek ini sudah ditutup',
        error_code: 403
      })
    }

    if (project.owner_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak diizinkan membuat tugas untuk proyek ini',
        error_code: 403
      });
    }

    const newTask = await models.Project_Task.create({
      project_id: id,
      task_number,
      task_description,
      task_status,
      task_feedback
    });

    res.status(201).json({
      success: true,
      message: 'Tugas proyek berhasil dibuat',
      data: newTask,
      error_code: 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error_code: 500
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId, projectId } = req.params;
    const { user_id } = getUserId(req);
    const project = await models.Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyek tidak ditemukan',
        error_code: 404
      })
    }

    if (project.owner_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak diizinkan menghapus tugas proyek ini',
        error_code: 403
      })
    }

    const task = await models.Project_Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tugas proyek tidak ditemukan',
        error_code: 404
      })
    }

    await task.destroy();
    return res.status(200).json({
      success: true,
      message: 'Tugas proyek berhasil dihapus',
      error_code: 0
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error_code: 500
    })
  }
}

const getAllProjects = async (req, res) => {
  try {
    const { user_id } = getUserId(req);

    const user = await models.User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan!",
        error_code: 404
      });
    }

    const userPreferredCategory = user.profession;

    const projects = await models.Project.findAll({
      where: {
        is_active: true
      },
      include: [
        {
          model: models.User,
          as: 'owner_project',
          attributes: ['full_name', 'username', 'profession', 'photo']
        },
        {
          model: models.Category,
          as: 'category',
          attributes: ['name']
        },
        {
          model: models.Project_Task,
          as: 'project_tasks',
          attributes: ['task_number', 'task_description', 'task_status']
        },
        {
          model: models.Project_User_Bid,
          as: 'users_bid',
          attributes: ['id', 'project_id', 'user_id', 'budget_bid', 'message', 'is_selected']
        }
      ],
      order: [
        [literal(`CASE WHEN "category"."name" LIKE '%${userPreferredCategory}%' THEN 0 ELSE 1 END`), 'ASC'],
        ['created_date', 'DESC']
      ]
    });

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Proyek tidak ditemukan!",
        error_code: 404
      });
    }

    const projectsWithBidsCount = projects.map(project => {
      const projectData = project.toJSON();
      projectData.total_bids = project.users_bid.length;
      return projectData;
    });

    return res.status(200).json({
      success: true,
      data: {
        projects: projectsWithBidsCount,
        total_projects: projectsWithBidsCount.length
      },
      message: "Proyek berhasil diambil",
      error_code: 0
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil semua proyek:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
}


const getAllProjectsAdmin = async (req, res) => {
  try {
    const { is_active } = req.query;

    let filter = {};
    if (is_active !== undefined) {
      filter.is_active = is_active === 'true';
    }

    const projects = await models.Project.findAll({
      where: filter,
      include: [
        {
          model: models.User,
          as: 'owner_project',
          attributes: ['full_name', 'username', 'profession', 'photo']
        },
        {
          model: models.Category,
          as: 'category',
          attributes: ['name']
        },
        {
          model: models.Project_Task,
          as: 'project_tasks',
          attributes: ['task_number', 'task_description', 'task_status']
        },
        {
          model: models.Project_User_Bid,
          as: 'users_bid',
          attributes: ['id']
        }
      ]
    });

    if (!projects || projects.length === 0) {
      return res.status(200).json({
        success: false,
        data: [],
        message: "Proyek tidak ditemukan!",
        error_code: 200
      });
    }

    const projectsWithBidsCount = projects.map(project => {
      const projectData = project.toJSON();
      projectData.total_bids = project.users_bid.length;
      return projectData;
    });

    return res.status(200).json({
      success: true,
      data: projectsWithBidsCount,
      total_data: projectsWithBidsCount.length,
      message: "Proyek berhasil diambil",
      error_code: 0
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil semua proyek:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};


const updateProjectActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const project = await models.Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proyek tidak ditemukan",
        error_code: 404
      });
    }

    await project.update({ is_active });

    return res.status(200).json({
      success: true,
      message: `Status aktif proyek berhasil diperbarui menjadi ${is_active}`,
      error_code: 0
    });
  } catch (error) {
    console.error("Kesalahan saat memperbarui status aktif proyek:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500
    });
  }
};



const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await models.Project.findByPk(id, {
      include: [
        { model: models.User, as: 'owner_project', attributes: ['full_name', 'username', 'profession', 'photo', 'sentiment_owner_score', 'sentiment_owner_analisis', 'sentiment_freelance_analisis', 'sentiment_freelance_score'] },
        { model: models.Category, as: 'category', attributes: ['name'] },
        { model: models.Project_Task, as: 'project_tasks', attributes: ['task_number', 'task_description', 'task_status'] },
      ]
    });

    const bids = await models.Project_User_Bid.findAll({
      where: { project_id: id },
      include: [
        { model: models.User, as: 'users_bid', attributes: ['full_name', 'username', 'profession', 'photo'] }
      ]
    });

    if (!project || !bids) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Proyek tidak ditemukan",
        error_code: 404
      });
    }

    const usersBid = bids.map(bid => bid.users_bid).filter(user => user);

    const formattedProject = formatDates(project.toJSON(), ['min_deadline', 'max_deadline', 'created_date']);

    const responseData = {
      ...formattedProject,
      users_bid: usersBid,
      total_bidders: usersBid.length,
      deadline_duration: project.deadline_duration
    };

    return res.status(200).json({
      success: true,
      data: responseData,
      message: "Detail proyek berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil detail proyek:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};


const getOwnerProjects = async (req, res) => {
  try {
    const { user_id } = getUserId(req);
    console.log('user id ', user_id);
    const projects = await models.Project.findAll({
      where: { owner_id: user_id },
      include: [
        { model: models.Category, as: 'category', attributes: ['name'] },
        { model: models.Project_Task, as: 'project_tasks', attributes: ['task_number', 'task_description', 'task_status'] },
        {
          model: models.Project_User_Bid,
          as: 'users_bid',
          attributes: ['user_id', 'budget_bid', 'is_selected'],
          include: [
            { model: models.User, as: 'users_bid', attributes: ['full_name', 'username', 'profession', 'photo'] }
          ]
        },
      ]
    });

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Proyek tidak ditemukan!",
        error_code: 404
      });
    }

    const dateFields = ['min_deadline', 'max_deadline', 'created_date'];

    const formattedProjects = projects.map(project => {
      const projectData = project.toJSON();
      projectData.total_bidders = projectData.users_bid.length;
      projectData.selected_user_bid = projectData.users_bid.find(bid => bid.is_selected) || null;
      return formatDates(projectData, dateFields, 'd-MMM-yyyy');
    });

    return res.status(200).json({
      success: true,
      data: {
        projects: formattedProjects,
        total_projects: projects.length,
      },
      message: "Proyek berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil proyek pemilik:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const changeTaskStatus = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { user_id } = getUserId(req);

    const project = await models.Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proyek tidak ditemukan",
        error_code: 404
      });
    }

    const task = await models.Project_Task.findByPk(taskId);
    if (!task || task.project_id !== projectId) {
      return res.status(404).json({
        success: false,
        message: "Tugas proyek tidak ditemukan atau tidak sesuai dengan proyek",
        error_code: 404
      });
    }

    if (task.freelancer_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk mengubah status tugas proyek ini",
        error_code: 403
      });
    }

    const status = 'DONE';

    await task.update({
      task_status: status
    });

    return res.status(200).json({
      success: true,
      message: "Status tugas proyek selesai dikerjakan",
      error_code: 0
    });

  } catch (error) {
    console.error("Ada sebuah error: ", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500
    });
  }
};


const changeProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = getUserId(req);

    const project = await models.Project.findByPk(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proyek tidak ditemukan",
        error_code: 404
      });
    }

    const isFreelancer = await models.Project_Task.findOne({
      where: {
        project_id: id,
        freelancer_id: user_id
      }
    });

    if (!isFreelancer) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk mengubah status proyek ini",
        error_code: 403
      });
    }

    // const project_tasks = await models.Project_Task.findAll({
    //   where: {
    //     project_id: id
    //   }
    // });

    // const allTasksDone = project_tasks.every(task => task.task_status === 'DONE');

    // if (!allTasksDone) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Tidak dapat mengubah status proyek karena tidak semua tugas selesai",
    //     error_code: 400
    //   });
    // }

    const status = 'FINISHED';

    const updateProject = await project.update({
      status_project: status
    });

    await updateProject.save()

    return res.status(200).json({
      success: true,
      message: "Status proyek selesai dikerjakan",
      error_code: 0
    });

  } catch (error) {
    console.error("Kesalahan saat mengubah status proyek:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500
    });
  }
};



const getUserProjectBids = async (req, res) => {
  try {
    const { user_id } = getUserId(req);
    const userProjectBids = await models.Project_User_Bid.findAll({
      where: { user_id: user_id },
      include: [{
        model: models.Project, as: 'project',
        include: [
          {
            model: models.User, as: 'owner_project', attributes: ['full_name', 'username', 'email', 'photo', 'profession',
              'sentiment_owner_analisis', 'sentiment_freelance_analisis'
            ]
          },
          { model: models.Project_Task, as: 'project_tasks', attributes: ['task_number', 'task_description', 'task_status'] },
          { model: models.Project_User_Bid, as: 'users_bid', attributes: ['id'] },
        ],
      }]
    });

    if (!userProjectBids || userProjectBids.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Tawaran proyek pengguna tidak ditemukan",
        error_code: 404,
      });
    }

    const formattedProjectBids = userProjectBids.map(bid => {
      const projectData = bid.project.toJSON();
      projectData.total_bidders = projectData.users_bid.length;
      return {
        ...bid.toJSON(),
        project: formatDates(projectData, ['min_deadline', 'max_deadline'], 'd-MMM-yyyy'),
      };
    });

    const totalBids = await models.Project_User_Bid.count({
      where: { user_id }
    });

    return res.status(200).json({
      success: true,
      data: {
        users_bid: formattedProjectBids,
        total_users_bids: totalBids,
      },
      message: "Tawaran proyek pengguna berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil tawaran proyek pengguna:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};


const ownerSelectBidder = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = getUserId(req);
    const { freelancer_id } = req.body;

    const project = await models.Project.findOne({
      where: {
        id: id,
        owner_id: user_id,
        is_active: true
      }
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki izin untuk memilih bidder untuk proyek ini",
        error_code: 403,
      });
    }

    const existingSelectedBid = await models.Project_User_Bid.findOne({
      where: {
        project_id: id,
        is_selected: true
      }
    });

    if (existingSelectedBid) {
      return res.status(400).json({
        success: false,
        message: "Bidder telah dipilih untuk proyek ini",
        error_code: 400,
      });
    }

    const existingUnselectedBid = await models.Project_User_Bid.findOne({
      where: {
        project_id: id,
        is_selected: false
      }
    })

    if (!existingUnselectedBid) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada bidder yang tersedia",
        error_code: 400,
      })
    }

    if (existingUnselectedBid.user_id === freelancer_id && existingUnselectedBid.is_selected === true) {
      return res.status(400).json({
        success: false,
        message: "Bidder ini telah dipilih",
        error_code: 400,
      })
    }

    const selectedBidder = await models.Project_User_Bid.findOne({
      where: {
        project_id: id,
        user_id: freelancer_id,
        is_selected: false
      }
    })

    console.log(selectedBidder)

    await models.Project.update(
      {
        status_project: 'CLOSE',
        status_freelance_task: 'CLOSE',
        fee_owner_transaction_value: selectedBidder.budget_bid,
        fee_freelance_transaction_value: selectedBidder.budget_bid,
      },
      { where: { id } }
    );

    await models.Project_Task.update(
      { freelancer_id: freelancer_id },
      { where: { project_id: id } }
    );

    return res.status(200).json({
      success: true,
      message: "Freelancer berhasil dipilih",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat memilih freelancer:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const deleteBidder = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = getUserId(req);
    const { bidder_id } = req.body;

    const project = await models.Project.findOne({
      where: {
        id: id,
        owner_id: user_id
      }
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki izin untuk menghapus bidder dari proyek ini",
        error_code: 403,
      });
    }

    const existingBid = await models.Project_User_Bid.findOne({
      where: {
        project_id: id,
        user_id: bidder_id
      }
    });

    if (!existingBid) {
      return res.status(400).json({
        success: false,
        message: "Bidder tidak ditemukan atau tidak valid untuk proyek ini",
        error_code: 400,
      });
    }

    await models.Project.update({
      status_project: 'OPEN',
      fee_owner_transaction_value: 0,
      fee_freelancer_transaction_value: 0,
    },
      { where: { id } }
    )

    //* Bisa destroy atau kita is selected kita hilangkan
    await existingBid.destroy();

    return res.status(200).json({
      success: true,
      message: "Bidder berhasil dihapus dari proyek",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat menghapus bidder:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};



const getUserSelectedProjectBids = async (req, res) => {
  try {
    const { user_id } = getUserId(req);
    const userSelectedProjectBids = await models.Project_User_Bid.findAll({
      where: {
        user_id: user_id,
        is_selected: true,
      },
      include: [{
        model: models.Project,
        as: 'project',
        include: [
          { model: models.Project_Task, as: 'project_tasks', attributes: ['task_number', 'task_description', 'task_status'] },
          {
            model: models.User, as: 'owner_project', attributes: ['full_name', 'photo', 'profession', 'username',
              'sentiment_owner_analisis', 'sentiment_freelance_analisis'
            ]
          }
        ]
      }]
    });

    if (!userSelectedProjectBids || userSelectedProjectBids.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Tawaran proyek yang dipilih pengguna tidak ditemukan",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: userSelectedProjectBids,
      message: "Tawaran proyek yang dipilih pengguna berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil tawaran proyek yang dipilih pengguna:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const getProjectList = async (req, res) => {
  try {
    const { title, category, min_budget, max_budget } = req.query;

    const searchConditions = {};

    if (title) {
      searchConditions.title = { [Op.like]: `%${title}%` };
    }

    if (min_budget) {
      if (!searchConditions.min_budget) searchConditions.min_budget = {};
      searchConditions.min_budget[Op.gte] = parseFloat(min_budget);
    }

    if (max_budget) {
      if (!searchConditions.max_budget) searchConditions.max_budget = {};
      searchConditions.max_budget[Op.lte] = parseFloat(max_budget);
    }

    const projects = await models.Project.findAll({
      where: { ...searchConditions, is_active: true },
      include: [
        {
          model: models.User,
          as: 'owner_project',
          attributes: ['full_name', 'username', 'email', 'photo']
        },
        {
          model: models.Category,
          as: 'category',
          attributes: ['name'],
          where: category ? { name: { [Op.like]: `%${category}%` } } : {},
        }
      ]
    });

    const dateFields = ['min_deadline', 'max_deadline', 'created_date'];

    const formattedProjects = projects.map(project => {
      return formatDates(project.toJSON(), dateFields, 'd-MMM-yyyy');
    });

    if (projects.length === 0) {
      return res.status(200).json({
        success: false,
        data: [],
        message: "Proyek tidak ditemukan",
        error_code: 200
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        projects: formattedProjects,
        total_projects: projects.length
      },
      message: "Daftar proyek berhasil diambil",
      error_code: 0
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil daftar proyek:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500
    });
  }
};

const searchProjectsByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Masukkan title project",
        error_code: 400,
      });
    }

    const projects = await models.Project.findAll({
      where: {
        title: {
          [Op.like]: `%${title}%`,
        }
      },
      include: [
        {
          model: models.User,
          as: 'owner_project',
          attributes: ['full_name', 'username', 'profession', 'photo']
        },
        {
          model: models.Category,
          as: 'category',
          attributes: ['name']
        },
        {
          model: models.Project_User_Bid,
          as: 'users_bid',
          attributes: ['id']
        }
      ]
    });

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Proyek tidak ditemukan!",
        error_code: 404,
      });
    }

    const formattedProjects = projects.map(project => {
      const projectData = project.toJSON();
      projectData.total_bids = project.users_bid.length;
      return formatDates(projectData, ["min_deadline", "max_deadline", "created_date"]);
    });

    return res.status(200).json({
      success: true,
      data: {
        projects: formattedProjects,
      },
      message: "Proyek berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat mencari proyek:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};


const postBid = async (req, res) => {
  try {
    const { user_id } = getUserId(req);
    const { project_id, budget_bid } = req.body;
    const project = await models.Project.findByPk(project_id);

    if (!project || project.is_active === false) {
      return res.status(404).json({
        success: false,
        message: "Proyek tidak ditemukan",
        error_code: 404,
      });
    }

    if (project.status_project !== 'OPEN') {
      return res.status(402).json({
        success: false,
        message: "Proyek tidak dalam status OPEN",
        error_code: 402,
      });
    }

    if (project.owner_id === user_id) {
      return res.status(403).json({
        success: false,
        message: "Anda adalah pemilik proyek ini",
        error_code: 403,
      });
    }

    const existingBid = await models.Project_User_Bid.findOne({
      where: {
        project_id,
        user_id
      }
    });

    if (existingBid) {
      return res.status(406).json({
        success: false,
        message: "Anda sudah membuat tawaran untuk proyek ini",
        error_code: 406,
      });
    }

    if (budget_bid < project.min_budget) {
      return res.status(400).json({
        success: false,
        message: "Budget bid tidak boleh lebih rendah dari minimum budget proyek",
        error_code: 400,
      });
    }

    if (budget_bid > project.max_budget) {
      return res.status(400).json({
        success: false,
        message: "Budget bid tidak boleh lebih tinggi dari maksimal budget proyek",
        error_code: 400,
      });
    }


    const projectBid = await models.Project_User_Bid.create({
      ...req.body,
      user_id
    });

    return res.status(201).json({
      success: true,
      data: projectBid,
      message: "Tawaran proyek berhasil dibuat",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat membuat tawaran proyek:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const changeStatusProject = async (req, res) => {
  try {

    const { id } = req.params;

    const project = await models.Project.findByPk(id);


    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proyek tidak ditemukan",
        error_code: 404
      })
    }

    await project.update({
      status_project: 'FINISHED',
      where: {
        id
      }
    })

    return res.status(200).json({
      success: true,
      message: "Proyek selesai dikerjakan",
      error_code: 0
    })

  } catch (error) {
    console.error('Ada sebuah error: ', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error_code: 500
    })
  }
}


const getProjectBidders = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await models.Project.findByPk(id, {
      include: [
        { model: models.User, as: 'owner_project', attributes: ['full_name', 'username', 'profession', 'photo', 'sentiment_owner_analisis', 'sentiment_freelance_analisis'] },
        { model: models.Category, as: 'category', attributes: ['name'] }
      ]
    });

    if (!project) {
      return res.status(200).json({
        success: false,
        data: [],
        message: "Proyek tidak ditemukan",
        error_code: 200,
      });
    }

    const bids = await models.Project_User_Bid.findAll({
      where: { project_id: id },
      include: [
        {
          model: models.User, as: 'users_bid', attributes: ['id', 'full_name', 'username', 'profession', 'photo',
            'sentiment_owner_analisis', 'sentiment_freelance_analisis']
        }
      ]
    });

    const formattedProject = formatDates(project.toJSON(), ['min_deadline', 'max_deadline', 'created_date']);

    let bidders = [];
    if (bids && bids.length > 0) {
      bidders = bids.map(bid => {
        const bidder = bid.users_bid.toJSON();
        bidder.is_selected = bid.is_selected;
        bidder.budget_bid = bid.budget_bid;
        bidder.message = bid.message;
        return bidder;
      }).filter(user => user !== null);
    }

    const responseData = {
      ...formattedProject,
      users_bid: bidders,
      total_bidders: bidders.length
    };

    return res.status(200).json({
      success: true,
      data: responseData,
      message: "Detail proyek dan informasi penawar berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil detail proyek dan informasi penawar:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const getProjectDigitalContract = async (req, res) => {
  try {
    const chatRoomId = req.query.chatRoomId;

    const cekChatRoomId = await models.Project.findOne({
      where: { chatroom_id: chatRoomId },
    });

    if (!cekChatRoomId) {
      return res.status(404).json({
        success: false,
        message: "Digital Contract tidak ditemukan",
        error_code: 404
      });
    }

    const date_started = await getStartDateByChatRoomId(chatRoomId);
    const reformattedDateStarted = date_started.split('-').reverse().join('-');

    const owner_id = await getOwnerIdByChatRoomId(chatRoomId);
    const project_owner = await models.User.findOne({
      where: { id: owner_id },
      attributes: ['full_name']
    })

    const freelancer_id = await getFreelancerIdByChatRoomId(chatRoomId);
    const freelancer = await models.User.findOne({
      where: { id: freelancer_id },
      attributes: ['full_name']
    })

    const projects_detail = await models.Project.findOne({
      where: { chatroom_id: chatRoomId },
      attributes: ['title', 'description', 'min_deadline', 'max_deadline']
    });

    const formattedMaxDeadline = projects_detail.max_deadline.toISOString().slice(0, 10);
    const formattedMinDeadline = projects_detail.min_deadline.toISOString().slice(0, 10);

    const reformattedMaxDeadline = formattedMaxDeadline.split('-').reverse().join('-');
    const reformattedMinDeadline = formattedMinDeadline.split('-').reverse().join('-');

    const project_id = await getProjectIdByChatRoomId(chatRoomId);
    const budget_bid = await models.Project_User_Bid.findOne({
      where: { project_id: project_id, is_selected: true },
      attributes: ['budget_bid']
    });

    if (budget_bid == null) {
      return res.status(404).json({
        success: false,
        message: "Budget bid tidak ditemukan",
        error_code: 404
      });
    }

    const milestone = await models.Project_Task.findAll({
      where: { project_id: project_id },
      attributes: ['task_number', 'task_description']
    });

    const responseData = {
      date_started: reformattedDateStarted,
      project_owner_name: project_owner.full_name,
      freelancer_name: freelancer.full_name,
      project_title: projects_detail.title,
      project_description: projects_detail.description,
      max_deadline: reformattedMaxDeadline,
      min_deadline: reformattedMinDeadline,
      budget: budget_bid.budget_bid,
      milestone,
      owner_userId: owner_id,
      freelancer_userId: freelancer_id
    }

    return res.status(200).json({
      data: responseData,
      success: true,
      message: "Berhasil mengambil detail proyek digital contract",
      error_code: 0,
    });
  }
  catch (error) {
    console.error("Kesalahan saat mengambil detail proyek digital contract:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
}

module.exports = {
  postProject,
  getOwnerProjects,
  getUserProjectBids,
  getUserSelectedProjectBids,
  postBid,
  deleteBidder,
  getProjectById,
  ownerSelectBidder,
  getAllProjects,
  getAllProjectsAdmin,
  updateProjectActiveStatus,
  postTask,
  deleteTask,
  getAllTask,
  getProjectList,
  getProjectBidders,
  getUserJobStatsAndBids,
  searchProjectsByTitle,
  changeStatusProject,
  getProjectDigitalContract,
  changeProjectStatus,
  changeTaskStatus
};
