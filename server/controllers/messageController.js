const Message = require('../models/Message');

exports.saveMessage = async ({ user, message, room }) => {
  const msg = new Message({ user, message, room });
  await msg.save();
};

exports.getMessagesByRoom = async (room) => {
  return await Message.find({ room }).sort({ timestamp: 1 }).limit(50);
};
