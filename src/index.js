const Botkit = require("botkit");
const axios = require("axios");
const cron = require("node-cron");

const utils = require("./utils/utils");

const controller = Botkit.slackbot({
  debug: true
});

const bot = controller
  .spawn({ token: "xoxb-553244316689-554156334197-dIbgsCrAzN2RX2Rgbd9OT98Q" })
  .startRTM();

controller.hears("namastop", "direct_message", async function(bot, message) {
  try {
    const { text, user } = message;

    const to = utils.getUserFromMessage(text);
    const formatText = utils.getFormatText(text, to);

    if (to == "") {
      bot.reply(message, "Oops, I could not identify who your message was.");
      return;
    }

    getUserInformation(user).then(fromInformations => {
      getUserInformation(to).then(toInforations => {
        const feedback = {
          to: toInforations.name,
          toEmail: toInforations.profile.email,
          message: formatText,
          from: fromInformations.name,
          fromEmail: fromInformations.profile.email
        };

        axios.post("http://localhost:3333/api/feedbacks", feedback);

        bot.reply(message, "Your feedback has been sent successfully ;)");
      });
    });
  } catch (error) {
    bot.reply(message, "Your feedback could not be sent, please try again :/");
  }
});

const getUserInformation = async user => {
  return new Promise((resolve, reject) => {
    return bot.api.users.info({ user }, (error, response) => {
      if (error != null) reject(error);
      resolve(response.user);
    });
  });
};

cron.schedule("* * * * Friday", function() {
  bot.api.users.list({}, function(err, { members }) {
    var users = members.filter(member => member.is_bot == false);
    users.map(member =>
      bot.say({
        text: "Please remember to send feedback this week at @namastop",
        channel: member.id
      })
    );
  });
});
