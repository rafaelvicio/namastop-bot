const getUserFromMessage = message => {
  const start = message.indexOf("@");
  const end = message.indexOf(">");
  return message.substring(start + 1, end);
};

const getFormatText = (text, user) => {
  return text.replace("namastop", "").replace(`<@${user}>`, "");
};

module.exports = {
  getUserFromMessage,
  getFormatText
};
