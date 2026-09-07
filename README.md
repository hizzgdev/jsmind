# jsMind

[![npm version](https://badge.fury.io/js/jsmind.svg)](https://www.npmjs.com/package/jsmind)
![build-test](https://github.com/hizzgdev/jsmind/actions/workflows/node.js.yml/badge.svg)

jsMind 是一个显示/编辑思维导图的纯 javascript 类库，其基于 html5 canvas 和 svg 进行设计。jsMind 以 [BSD 协议开源](LICENSE)，在此基础上你可以在你的项目上任意使用。

jsMind is mind map library built by javascript, it base on html5 canvas and svg. jsMind is released under [the BSD license](LICENSE), you can embed it in any project as long as you abide by the license.

## Project Home

-   [jsMind on Github](https://github.com/hizzgdev/jsmind)
-   [国内镜像 - Gitee](https://gitee.com/hizzgdev/jsmind)

## Get Started

```html
<html>
    <head>
        <link
            type="text/css"
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/jsmind@0.9.1/style/jsmind.css"
        />
        <script
            type="text/javascript"
            src="https://cdn.jsdelivr.net/npm/jsmind@0.9.1/es6/jsmind.js"
        ></script>
    </head>
    <body>
        <div id="jsmind_container"></div>

        <script type="text/javascript">
            var mind = {
                meta: {
                    name: 'jsMind-demo-tree',
                    author: 'hizzgdev@163.com',
                    version: '1.0',
                },
                // 3 data formats were supported ...
                // see documents for more information
                format: 'node_tree',
                data: { id: 'root', topic: 'jsMind' },
            };
            var options = {
                container: 'jsmind_container',
                theme: 'orange',
                editable: true,
            };
            var jm = new jsMind(options);
            jm.show(mind);
        </script>
    </body>
</html>
```

## Links

-   Resources:
    -   [文档 - Documents](https://hizzgdev.github.io/jsmind/docs)
    -   [NPM - jsmind](https://www.npmjs.com/package/jsmind)
    -   CDN - [用法](docs/zh/1.usage.md) [Usage](docs/en/1.usage.md)
        -   [UNPKG](https://unpkg.com/browse/jsmind/)
        -   [jsDelivr](https://www.jsdelivr.com/package/npm/jsmind/)
        -   [jsDelivr 国内镜像](https://jsd.onmicrosoft.cn/npm/jsmind/)
-   Apps :
    -   <https://jsmind.online>
-   Demo :
    -   [显示一个脑图 Render a mindmap](https://hizzgdev.github.io/jsmind/example/1_basic.html) [[国内版](https://hizzgdev.github.io/jsmind/example/1_basic_cn.html)]
    -   [试用所有功能 Try all features](https://hizzgdev.github.io/jsmind/example/2_features.html) [[国内版](https://hizzgdev.github.io/jsmind/example/2_features_cn.html)]
    -   [requirejs + jsMind](https://hizzgdev.github.io/jsmind/example/3_requirejs.html)
    -   [更多示例 - More samples](https://github.com/hizzgdev/jsmind-samples) [[国内版](https://gitee.com/hizzgdev/jsmind-samples)]

## Funding

-   [致谢 - Acknowledgement](https://hizzgdev.github.io/acknowledgement.html)
-   [资助 - Sponsor](https://hizzgdev.github.io/sponsor.html)

## Maintainer

-   [张志刚 - Zhigang Zhang](https://hizzgdev.github.io)


## 🌐 Web Resources & Interactive Index
- [CLASH OF STONE](https://brainquestsfr.pages.dev/clash-of-stone.html)
- [CATEGORY SHOOTER](https://eduquestkr.pages.dev/category-shooter.html)
- [STICKMAN ADVENTURE](https://welearnaction.onrender.com/stickman-adventure.html)
- [CITY BANANA MAN AGENT](https://brainquests.pages.dev/city-banana-man-agent.html)
- [DADDY RABBIT](https://brainquests.pages.dev/daddy-rabbit.html)
- [DRAW TO HOME 3D](https://brainquests.pages.dev/draw-to-home-3d.html)
- [CATEGORY RELAXING221](https://brainquests.pages.dev/category-relaxing221.html)
- [MAGECLASH IO](https://brainquests.pages.dev/mageclash-io.html)
- [TEAM LOYALTY](https://brainquests.pages.dev/team-loyalty.html)
- [HYPERMARKET 3D STORE CASHIER](https://brainquests.pages.dev/hypermarket-3d-store-cashier.html)
- [CATEGORY HUB](https://brainquests.pages.dev/category-hub.html)
- [PERFECT PIANO MAGIC](https://brainquests.pages.dev/perfect-piano-magic.html)
- [CATEGORY ARCHERY](https://brainquests.pages.dev/category-archery.html)
- [CATEGORY TITANIUMNETWORK PROXIES](https://brainquests.pages.dev/category-titaniumnetwork-proxies.html)
- [FRUIT MAHJONG 3D](https://brainquests.pages.dev/fruit-mahjong-3d.html)
- [10K](https://brainquests.pages.dev/10k.html)
- [WAR OF GUN](https://brainquests.pages.dev/war-of-gun.html)
- [STEAL BRAINROT ARENA](https://brainquests.pages.dev/steal-brainrot-arena.html)
- [CATEGORY BATTLESHIP](https://eduquests.github.io/category-battleship.html)
- [BOUNCY BOMB BUDDIES](https://brainquests.pages.dev/bouncy-bomb-buddies.html)
- [TRUCK SIMULATOR RUSSIA](https://eduquests.onrender.com/truck-simulator-russia.html)
- [CHIBI DOLL COLORING DRESS UP](https://ieduquests.web.app/chibi-doll-coloring-dress-up.html)
- [CATEGORY EDUCATIONAL](https://eduquests.github.io/category-educational.html)
- [STICK KILL 3D](https://brainquests.pages.dev/stick-kill-3d.html)
- [ONLINE PORTAL](https://studyplaying.github.io/)
- [ORDER OF OPERATION CHALLENGE](https://eduquests.github.io/order-of-operation-challenge.html)
- [CROSS THE ROAD](https://brainquests.pages.dev/cross-the-road.html)
- [VEHICLE FUN RACE](https://eduquests.github.io/vehicle-fun-race.html)
- [FROGTASTIC MARBLE ADVENTURE](https://eduquests.github.io/frogtastic-marble-adventure.html)
- [TAP 3D BLOCKS](https://brainquests.pages.dev/tap-3d-blocks.html)
- [MAGE AND MONSTERS](https://brainquests.pages.dev/mage-and-monsters.html)
- [CATEGORY CASUAL 4](https://eduquests.github.io/category-casual-4.html)
- [AXE THROW](https://learnaction.github.io/axe-throw.html)
- [VEX X3M 2](https://eduquests.netlify.app/vex-x3m-2.html)
- [CATEGORY HERO71](https://brainquests.pages.dev/category-hero71.html)
- [PANDA KITCHEN IDLE TYCOON](https://eduquests.netlify.app/panda-kitchen-idle-tycoon.html)
- [CATEGORY BOARDGAMES](https://brainquests.pages.dev/category-boardgames.html)
- [PRIVACY](https://ilearnworldkr.pages.dev/privacy.html)
- [SITEMAP](https://skillcrafts.github.io/sitemap.html)
- [ASSOCIATION CONNECT WORD](https://brainquests.pages.dev/association-connect-word.html)
- [FALLING BLOCKS HALLOWEEN CHALLENGE](https://eduquests.netlify.app/falling-blocks-halloween-challenge.html)
- [CATEGORY FLASH](https://brainquests.pages.dev/category-flash.html)
- [BRIDGE WARS](https://eduquestsfr.pages.dev/bridge-wars.html)
- [GEOMETRY VIBES 3D](https://brainquests.pages.dev/geometry-vibes-3d.html)
- [BBQ STACK RUN](https://eduquestspt.pages.dev/bbq-stack-run.html)
- [CATEGORY ADVENTURE](https://brainquests.pages.dev/category-adventure.html)
- [CATEGORY CONTROLLER 2](https://eduquestses.pages.dev/category-controller-2.html)
- [JEWEL LINK](https://eduquestsfr.pages.dev/jewel-link.html)
- [BUBBLE SHOOTER CANDY WHEEL LEVEL PACK](https://brainquests.pages.dev/bubble-shooter-candy-wheel-level-pack.html)
- [DAZZLING DIVAS MAKEUP](https://brainquests.pages.dev/dazzling-divas-makeup.html)
- [ASOKA MAKEUP INDIAN BRIDE](https://brainquests.pages.dev/asoka-makeup-indian-bride.html)
- [LOOP SURVIVORS ZOMBIE CITY](https://ieduquests.web.app/loop-survivors-zombie-city.html)
- [CONTACT](https://eduquestses.pages.dev/contact.html)
- [NINJA WARS BATTLE SIMULATOR](https://ieduquests.web.app/ninja-wars-battle-simulator.html)
- [CATEGORY BASKETBALL](https://eduquestses.pages.dev/category-basketball.html)
- [CELEBRITY AESTHETIC CHALLENGE](https://learnaction.github.io/celebrity-aesthetic-challenge.html)
- [INDEX4](https://learnaction.netlify.app/index4.html)
- [CATEGORY EDUCATIONAL](https://eduquests.netlify.app/category-educational.html)
- [HEXON RUSH](https://ieduquests.web.app/hexon-rush.html)
- [EPIC CAR STUNT RACE OBBY](https://eduquests.onrender.com/epic-car-stunt-race-obby.html)
- [PIN PUZZLE SAVE THE SHEEP](https://brainquests.pages.dev/pin-puzzle-save-the-sheep.html)
- [CITY DRIFT RACING](https://eduquestsfr.pages.dev/city-drift-racing.html)
- [MURDER CASE CLUE 3D](https://eduquestsfr.pages.dev/murder-case-clue-3d.html)
- [SCHOOL LOVE STORY 1](https://eduquestsfr.pages.dev/school-love-story-1.html)
- [CATEGORY MOBILE2 112](https://ieduquests.web.app/category-mobile2-112.html)
- [GLADIATOR FIGHTS](https://eduquests.pages.dev/gladiator-fights.html)
- [CATEGORY TOWER DEFENSE118](https://eduquestspt.pages.dev/category-tower-defense118.html)
- [CATEGORY IDLE445](https://eduquestkr.pages.dev/category-idle445.html)
- [PARK FEVER](https://eduquestsfr.pages.dev/park-fever.html)
- [ONLINE PORTAL](https://brainquests.netlify.app/)
- [TERRA CRAFT WORLD](https://eduquestsfr.pages.dev/terra-craft-world.html)
- [CATEGORY CASUAL 12](https://eduquestses.pages.dev/category-casual-12.html)
- [SWEET AND FRUITY MAKEUP](https://eduquestspt.pages.dev/sweet-and-fruity-makeup.html)
- [CUBATORIA MERGE 2048](https://eduquestsfr.pages.dev/cubatoria-merge-2048.html)
- [SKYSCRAPER TO THE SKY](https://eduquests.pages.dev/skyscraper-to-the-sky.html)
- [ZOMBIE FRONTIER SHOOTER](https://eduquestses.pages.dev/zombie-frontier-shooter.html)
- [ROAD OF FURY 4](https://eduquestsfr.pages.dev/road-of-fury-4.html)
- [POP THEM](https://eduquestsfr.pages.dev/pop-them.html)
- [INK INC TATTOO](https://eduquests.pages.dev/ink-inc-tattoo.html)
- [ZEN SOLITAIRE](https://learnaction.github.io/zen-solitaire.html)
- [PERFECT ASMR CLEANING](https://eduquestses.pages.dev/perfect-asmr-cleaning.html)
- [CROSS THE ROAD](https://eduquests.pages.dev/cross-the-road.html)
- [FRUIT CONNECT 3](https://eduquestsfr.pages.dev/fruit-connect-3.html)
- [CATEGORY BLOCK94](https://welearnaction.onrender.com/category-block94.html)
- [CATEGORY INCREMENTAL](https://eduquestsfr.pages.dev/category-incremental.html)
- [CATEGORY COOKING](https://brainquests.pages.dev/category-cooking.html)
- [LAMBO TRAFFIC RACER](https://learnaction.github.io/lambo-traffic-racer.html)
- [MERGE BLOCKS 2048](https://ieduquests.web.app/merge-blocks-2048.html)
- [CATEGORY SIMULATION 3](https://eduquestspt.pages.dev/category-simulation-3.html)
- [NUMBER BUBBLE SHOOTER WILD WEST](https://eduquests.github.io/number-bubble-shooter-wild-west.html)
- [ZOMBIE HORDE BUILD SURVIVE](https://eduquestsfr.pages.dev/zombie-horde-build-survive.html)
- [SHIP FACTORY TYCOON](https://eduquestses.pages.dev/ship-factory-tycoon.html)
- [PINTURILLO](https://brainquests.pages.dev/pinturillo.html)
- [CATEGORY FIGHTING](https://welearnaction.onrender.com/category-fighting.html)
- [TRIANGLE WAY](https://eduquests.pages.dev/triangle-way.html)
- [HAPPY ASMR CARE](https://eduquestspt.pages.dev/happy-asmr-care.html)
- [BUBBLE SHOOTER REMASTERED](https://eduquests.netlify.app/bubble-shooter-remastered.html)
- [CATEGORY CASUAL 2](https://eduquestkr.pages.dev/category-casual-2.html)
- [BUS COLOR JAM](https://eduquests.netlify.app/bus-color-jam.html)
- [CATEGORY ART](https://eduquestkr.pages.dev/category-art.html)
- [BITBALL](https://eduquests.github.io/bitball.html)
- [CATEGORY AVOID295](https://eduquestses.pages.dev/category-avoid295.html)
- [GT CARS CITY RACING](https://learnaction.github.io/gt-cars-city-racing.html)
- [INDEX40](https://ieduquests.web.app/index40.html)
- [MARBLE RUN ULTIMATE RACE](https://eduquestkr.pages.dev/marble-run-ultimate-race.html)
- [TILE HEX WORLD RED VS BLUE](https://eduquests.pages.dev/tile-hex-world-red-vs-blue.html)
- [BACKYARD DIG HOLE 3D SIMULATOR](https://eduquestses.pages.dev/backyard-dig-hole-3d-simulator.html)
- [CATEGORY BATTLE ROYALE25](https://eduquestkr.pages.dev/category-battle-royale25.html)
- [PRIVACY](https://thelearnquesters.pages.dev/privacy.html)
- [PLANET TAKEOVER](https://ieduquests.web.app/planet-takeover.html)
- [CATEGORY UNBLOCKED](https://brainquests.pages.dev/category-unblocked.html)
- [CATEGORY DEEP IMMERSIVE24](https://welearnaction.onrender.com/category-deep-immersive24.html)
- [HOME RUSH THE FISH WAR](https://eduquestsfr.pages.dev/home-rush-the-fish-war.html)
- [COLOR STRINGS](https://eduquests.pages.dev/color-strings.html)
- [CATEGORY DIRT BIKE18](https://welearnaction.onrender.com/category-dirt-bike18.html)
- [MASTER OF 3 TILES](https://ieduquests.web.app/master-of-3-tiles.html)
- [GEOMETRY ARROW](https://eduquests.pages.dev/geometry-arrow.html)
- [CATEGORY BASKETBALL](https://eduquestspt.pages.dev/category-basketball.html)
- [CATEGORY IO](https://eduquestsfr.pages.dev/category-io.html)
- [TOWN RUN](https://brainquests.pages.dev/town-run.html)
- [INDEX4](https://welearnaction.onrender.com/index4.html)
- [MIRROR SHAPE](https://brainquests.pages.dev/mirror-shape.html)
- [CATEGORY ARENA255](https://eduquestkr.pages.dev/category-arena255.html)
- [POPS QUEST](https://eduquestses.pages.dev/pops-quest.html)
- [CATEGORY PARTY23](https://eduquests.github.io/category-party23.html)
- [ROBOCARPOLI](https://eduquestsfr.pages.dev/robocarpoli.html)
- [CRUNCH LOCKED](https://ieduquests.web.app/crunch-locked.html)
- [CATEGORY DRESS UP](https://eduquestspt.pages.dev/category-dress-up.html)
- [CATEGORY SURVIVAL365](https://eduquestspt.pages.dev/category-survival365.html)
- [TSUNAMI BRAINROTS ONLINE](https://ieduquests.web.app/tsunami-brainrots-online.html)
