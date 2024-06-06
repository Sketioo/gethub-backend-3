const jwt = require("jsonwebtoken");
const models = require('../models');
const { format } = require('date-fns');
const { id } = require('date-fns/locale');

const getOwnerIdByChatRoomId = async (chatRoomId) => {
    const project = await models.Project.findOne({ where: { chatroom_id: chatRoomId } });
    return project.owner_id;
};

const getFreelancerIdByChatRoomId = async (chatRoomId) => {
    const project = await models.Project.findOne({ where: { chatroom_id: chatRoomId } });
    const id = project.id;

    const freelancer_id = await models.Project_Task.findOne({ where: { project_id: id } });
    return freelancer_id.freelancer_id;
}

const getStartDateByChatRoomId = async (chatRoomId) => {
    const project = await models.Project.findOne({ where: { chatroom_id: chatRoomId } });
    const id = project.id;

    const task_number = 1;
    const start_date = await models.Project_Task.findOne({ where: { project_id: id, task_number: task_number } });
    return start_date.createdAt.toISOString().slice(0,10);
}

const getProjectIdByChatRoomId = async (chatRoomId) => {
    const project = await models.Project.findOne({ where: { chatroom_id: chatRoomId } });
    return project.id;
}

module.exports = {
    getOwnerIdByChatRoomId,
    getFreelancerIdByChatRoomId,
    getStartDateByChatRoomId,
    getProjectIdByChatRoomId
}
  