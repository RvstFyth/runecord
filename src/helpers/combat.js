module.exports = {
    async simulateAgaianstNpc(charInstance, mobDefinition) {
        let pIndex = 0;
        while (true) {
            if (mobDefinition.health < 1 || charInstance.health < 1) break;

            let maxAttackRoll,
                maxDefenceRoll,
                maxHitRoll,
                hitChance,
                currentPlayer,
                otherPlayer;
            if (pIndex === 0) {
                // Player turn
                currentPlayer = charInstance;
                otherPlayer = mobDefinition;
            } else {
                currentPlayer = mobDefinition;
                otherPlayer = charInstance;
            }

            maxAttackRoll = await this.calculateMaxAttack(currentPlayer);
            maxDefenceRoll = this.calculateMaxDefenceRoll(
                currentPlayer,
                otherPlayer
            );
            maxHitRoll = await this.calculateMaxHit(currentPlayer);

            if (maxAttackRoll > maxDefenceRoll) {
                hitChance =
                    1 - (maxDefenceRoll + 2) / (2 * (maxAttackRoll + 1));
            } else hitChance = maxAttackRoll / (2 * maxDefenceRoll + 1);
            // dps = hit_chance * (max_hit / 2) / attack_interval
            const dmg = parseInt(hitChance * (maxHitRoll / 2));

            otherPlayer.health -= parseInt(dmg);

            if (pIndex < 1) pIndex++;
            else pIndex = 0;
        }

        return charInstance;
    },

    calculateMaxDefenceRoll(attacker, defender) {
        const equipmentBonus =
            defender.equippedBonus.defence[attacker.attackType];
        const effectiveLevel = this.calculateEffectiveLevelDefenceNpc(defender);

        return effectiveLevel * (equipmentBonus + 64);
    },

    calculateEffectiveLevelDefenceNpc(charInstance, activePotions, prayer) {
        let result = charInstance.skills.defence.level;

        const potionBonus = 0; // TODO
        const prayerBonus = 1; // TODO

        if (charInstance.npc) result += 1;
        return result + 8;
    },

    calculateEffectiveLevelMaxHit(
        charInstance,
        activePotions = null,
        prayer = null
    ) {
        const attackStyleBonuses = {
            aggressive: 3,
            controlled: 1,
            accurate: 0,
        };
        const strength = parseInt(charInstance.skills.strength.level);

        const potionBonus = 0; // TODO
        const prayerBonus = 1; // TODO

        const attackStyle = charInstance.attackStyle; // TODO: should be a char setting
        const attackStyleBonus = attackStyleBonuses[attackStyle]
            ? attackStyleBonuses[attackStyle]
            : 0;

        return (
            parseInt((strength + potionBonus) * prayerBonus) +
            attackStyleBonus +
            8
        );
    },

    async calculateMaxHit(charInstance, activePotions, prayer) {
        await charInstance.loadEquipment();
        const effectiveLevel = this.calculateEffectiveLevelMaxHit(
            charInstance,
            activePotions,
            prayer
        );
        const equipmentBonus = charInstance.equippedBonus.other.melee;

        // max_hit = 0.5 + effective_level * (equipment_bonus + 64) / 640
        return parseInt(0.5 + (effectiveLevel * (equipmentBonus + 64)) / 640);
    },

    calculateEffectiveLevelMaxAttack(
        charInstance,
        activePotions = null,
        prayer = null
    ) {
        const attackStyleBonuses = {
            controlled: 1,
            accurate: 3,
        };
        const attack = parseInt(charInstance.skills.attack.level);

        const potionBonus = 0; // TODO
        const prayerBonus = 1; // TODO

        const attackStyle = charInstance.attackStyle; // TODO: should be a char setting
        const attackStyleBonus = attackStyleBonuses[attackStyle]
            ? attackStyleBonuses[attackStyle]
            : 0;

        return (
            parseInt((attack + potionBonus) * prayerBonus) +
            attackStyleBonus +
            8
        );
    },

    async calculateMaxAttack(charInstance, activePotions, prayer) {
        await charInstance.loadEquipment();
        const effectiveLevel = this.calculateEffectiveLevelMaxAttack(
            charInstance,
            activePotions,
            prayer
        );

        const equipmentBonus =
            charInstance.equippedBonus.attack[charInstance.attackType];
        return parseInt(effectiveLevel * (equipmentBonus + 64));
    },
};
