var Affects  = require('./../src/affects.js').Affects;

reql10n = require('../src/l10n');
var rl10n = reql10n(__dirname + '/../l10n/races/human.yml')
var pl10n = reql10n(__dirname + '/../l10n/scripts/player/player.js.yml')

exports.attributes = {
    hp: 3
};

exports.skills = {
    hide: {
        type: 'active',
        level: 2,
        name: "Hide",
        description: "Hide from other players and NPCs",
        cooldown: 6,
        l10n: require('../src/l10n')(__dirname + '/../l10n/skills/hide.yml'),
        notCombatUsable: function(player){
            player.sayL10n(this.l10n, 'HIDE_COMBAT');
        },
        offCooldown: function(player){
            //player.sayL10n(pl10n, 'COOLDOWN_END', "Test Replacement String");
        },
        activate: function(l10n, player, args, rooms, npcs, players)
        {
            var l10n = l10n || rl10n;
            player.addAffect("hidden", Affects.hidden({
                duration: 10,
                magnitude: 1.5,
                player: player,
                target: player,
                deactivate: function () {
                    player.sayL10n(l10n, 'HIDE_END_SELF');
                    players.eachAt(player.getLocation(),function(p){
                        if (p.getName() !== player.getName()){
                            p.sayL10n(l10n, 'HIDE_END_OTHERS', player.getName());
                        }
                    });
                }
            }));

            player.sayL10n(l10n, 'HIDE_ATTEMPT');

            player.sayL10n(l10n, 'HIDE_SUCCESS_SELF');
            players.eachAt(player.getLocation(),function(p){
                if (p.getName() !== player.getName()){
                    p.sayL10n(l10n, 'HIDE_SUCCESS_OTHERS', player.getName());
                }
            });

            return true;
        }
    }
};
