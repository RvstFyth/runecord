module.exports = {
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

        const attackStyle = 'controlled'; // TODO: should be a char setting
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
        const strength = parseInt(charInstance.skills.attack.level);

        const potionBonus = 0; // TODO
        const prayerBonus = 1; // TODO

        const attackStyle = 'accurate'; // TODO: should be a char setting
        const attackStyleBonus = attackStyleBonuses[attackStyle]
            ? attackStyleBonuses[attackStyle]
            : 0;

        return (
            parseInt((strength + potionBonus) * prayerBonus) +
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

        return parseInt();
    },
};
