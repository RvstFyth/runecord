const questsModel = require('../../../../../models/usersQuests');
const inventoryModel = require('../../../../../models/usersInventory');

module.exports = {
    label: `Survival expert`,
    description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui.`,

    async talk(data) {
        const firstQuest = await questsModel.getFor(data.userID, 1);
        if (firstQuest) {
            if (!firstQuest.completed) {
                await questsModel.setCompleted(
                    firstQuest.user_id,
                    firstQuest.quest_id
                );
                await data.msg.channel.send({
                    embed: {
                        title: `${data.user.name} quest completed!`,
                        description: firstQuest.name,
                    },
                });

                await questsModel.create(data.userID, 2);
                await inventoryModel.add(data.userID, 39, 1);
                return `**TODO (text):**\nFirst quest is completed here. SE should introduce himself a bit, and a new quest is given here: chop a tree`;
            }
        } else
            return `You might want to talk with the Runecord guide first.. You should have passed him on your way to here.`;

        const secondQuest = await questsModel.getFor(data.userID, 2);
        if (secondQuest && !secondQuest.completed)
            return `Did you chop that tree already? We really need it to continue...`;

        const thirdQuest = await questsModel.getFor(data.userID, 3);
        if (!thirdQuest) {
            await questsModel.create(data.userID, 3);
            await inventoryModel.add(data.userID, 38, 1);
            return `Chop a tree is completed here... New quests will be make a fire`;
        }
        if (thirdQuest && !thirdQuest.completed)
            return `You have to make a fire to to continue..`;

        const fourthQuest = await questsModel.getFor(data.userID, 4);
        if (!fourthQuest) {
            await questsModel.create(data.userID, 4);
            await inventoryModel.add(data.userID, 40, 1);
            return `Make a fire is completed here... New quests will be catch some shrimps`;
        }
        if (fourthQuest && !fourthQuest.completed)
            return `You have the raw shrimps already?`;

        const fifthQuest = await questsModel.getFor(data.userID, 5);
        if (!fifthQuest) {
            await questsModel.create(data.userID, 5);
            return `User caught shrimps... New quests will be cook shrimps`;
        }
        if (fifthQuest && !fifthQuest.completed)
            return `**${data.user.name}** did you cook those shrimps already?`;

        return `I learned you all that is possible in this short time. You should find the mining trainer now.`;
    },
};
