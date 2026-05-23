const User = require(
  '../users/user.model',
);

const CallLog = require(
  '../calls/call.model',
);

const DSR = require(
  '../dsr/dsr.model',
);

const teamStatus = async (
  req,
  res,
) => {
  try {
    const teamUsers =
      await User.find({
        managerId: req.user.id,

        role: 'TELECALLER',
      });

    const response =
      await Promise.all(
        teamUsers.map(
          async user => {
            const today =
              new Date()
                .toISOString()
                .split('T')[0];

            const calls =
              await CallLog.find({
                userId: user._id,

                createdAt: {
                  $gte: new Date(
                    today,
                  ),
                },
              });

            const followUps =
              calls.filter(
                item =>
                  item.callStatus ===
                  'FOLLOW_UP',
              ).length;

            const notAnswered =
              calls.filter(
                item =>
                  item.callStatus ===
                  'NOT_ANSWERED',
              ).length;

            const dsr =
              await DSR.findOne({
                userId: user._id,

                date: today,
              });

            return {
              userId: user._id,

              name: user.name,

              callsToday:
                calls.length,

              followUps,

              notAnswered,

              dsrSubmitted:
                !!dsr,

              lastUpdateTime:
                calls.length > 0
                  ? calls[
                      calls.length - 1
                    ].createdAt
                  : null,
            };
          },
        ),
      );

    res.status(200).json({
      success: true,

      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};



module.exports = {
  teamStatus,
};