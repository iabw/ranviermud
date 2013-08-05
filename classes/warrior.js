var Affects  = require('./../src/affects.js').Affects;

var l10n = require('../src/l10n')(__dirname + '/../l10n/skills/warrior.yml')
var pl10n = require('../src/l10n')(__dirname + '/../l10n/scripts/player/player.js.yml')

exports.attributes = {
    hp: '34-48'
};

exports.skills = {
    tackle: {
        type: 'active',
        level: 2,
        name: "Tackle",
        description: "Tackle your opponent for 120% weapon damage. Target's attacks are slower for 5 seconds following the attack.",
        cooldown: 4,
        activate: function (player, args, rooms, npcs)
        {
            if (!player.isInCombat()) {
                player.sayL10n(l10n, 'TACKLE_NOCOMBAT');
                return true;
            }

            if (player.getAffects('cooldown_tackle')) {
                player.sayL10n(l10n, 'TACKLE_COOLDOWN');
                return true;
            }

            var target = player.isInCombat();
            if (!target) {
                player.say("Somehow you're in combat with a ghost");
                return true;
            }

            var damage = Math.min(target.getAttribute('max_health'), Math.ceil(player.getDamage().max * 1.2));

            player.sayL10n(l10n, 'TACKLE_DAMAGE', damage);
            target.setAttribute('health', target.getAttribute('health') - damage);

            if (!target.getAffects('slow')) {
                target.addAffect('slow', Affects.slow({
                    duration: 3,
                    magnitude: 1.5,
                    player: player,
                    target: target,
                    deactivate: function () {
                        player.sayL10n(l10n, 'TACKLE_RECOVER');
                    }
                }));
            }

            // Slap a cooldown on the player
            player.addAffect('cooldown_tackle', {
                duration: 4,
                deactivate: function () {
                    player.sayL10n(l10n, 'TACKLE_COOLDOWN_END');
                }
            });

            return true;
        }
    },
    battlehardened: {
        type: 'passive',
        level: 5,
        name: "Battle Hardened",
        description: "Your experience in battle has made you more hardy. Max health is increased by 200",
        activate: function (player)
        {
            if (player.getAffects('battlehardened')) {
                player.removeAffect('battlehardened');
            }
            player.addAffect('battlehardened', Affects.health_boost({
                magnitude: 200,
                player: player,
                event: 'quit'
            }));
        }
    }
};
