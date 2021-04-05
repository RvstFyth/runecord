module.exports = {
    label: 'Ellis',
    chatHead: 'Ellis_chathead.png',
    type: 'tanner',
    async talk(data) {
        if (data.args[0]) {
            switch (data.args[0]) {
                case '1':
                    return (
                        `I make leather from animal hides. Bring me some cowhides and one gold coin per hide, and I'll tan them into soft leather for you.\n\n` +
                        `Use \`${data.prefix}tan <amount> [type]\` to let Ellis tan hides for you. Example: \`${data.prefix}tan 2 leather\``
                    );
                case '2':
                    return (
                        `Normal leather may be quite weak, but it's very cheap - I make it from cowhides for only 1 gp per hide - and it's so easy to craft that anyone can work with it.\n` +
                        `Alternatively you could try hard leather. It's not so easy to craft, but I only charge 3 gp per cowhide to prepare it, and it makes much sturdier armour.\n` +
                        `I can also tan snake hides and dragonhides, suitable for crafting into the highest quality armour for rangers.`
                    );
            }
        }

        return (
            `Greetings friend. I am a manufacturer of leather.\n\n` +
            `\`1\` Can I buy some leather then?\n` +
            `\`2\` Leather is rather weak stuff.`
        );
    },
};
