#!/usr/bin/env python3
"""Add Chinese classic book passages to passages.json."""
import json

CHINESE_PASSAGES = [
    # 论语 - Confucius
    {"bookTitle": "论语", "author": "孔子", "tags": ["philosophy", "chinese", "confucianism", "ancient", "wisdom"], "language": "zh", "passages": [
        "子曰：「学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？」",
        "子曰：「温故而知新，可以为师矣。」",
        "子曰：「学而不思则罔，思而不学则殆。」",
        "子曰：「知之者不如好之者，好之者不如乐之者。」",
        "子曰：「三人行，必有我师焉。择其善者而从之，其不善者而改之。」",
        "子曰：「己所不欲，勿施于人。」",
        "子曰：「君子坦荡荡，小人长戚戚。」",
    ]},
    # 道德经 - Lao Tzu
    {"bookTitle": "道德经", "author": "老子", "tags": ["philosophy", "chinese", "taoism", "ancient", "wisdom"], "language": "zh", "passages": [
        "道可道，非常道；名可名，非常名。无名，天地之始；有名，万物之母。故常无欲，以观其妙；常有欲，以观其徼。此两者同出而异名，同谓之玄。玄之又玄，众妙之门。",
        "上善若水。水善利万物而不争，处众人之所恶，故几于道。居善地，心善渊，与善仁，言善信，政善治，事善能，动善时。夫唯不争，故无尤。",
        "天下皆知美之为美，斯恶已；皆知善之为善，斯不善已。有无相生，难易相成，长短相形，高下相盈，音声相和，前后相随，恒也。",
        "知人者智，自知者明。胜人者有力，自胜者强。知足者富，强行者有志。不失其所者久，死而不亡者寿。",
        "大方无隅，大器免成，大音希声，大象无形。道隐无名。夫唯道，善贷且成。",
        "天下之至柔，驰骋天下之至坚。无有入无间，吾是以知无为之有益。不言之教，无为之益，天下希及之。",
        "合抱之木，生于毫末；九层之台，起于累土；千里之行，始于足下。",
    ]},
    # 庄子 - Zhuangzi
    {"bookTitle": "庄子", "author": "庄子", "tags": ["philosophy", "chinese", "taoism", "ancient", "parable"], "language": "zh", "passages": [
        "北冥有鱼，其名为鲲。鲲之大，不知其几千里也；化而为鸟，其名为鹏。鹏之背，不知其几千里也；怒而飞，其翼若垂天之云。",
        "昔者庄周梦为蝴蝶，栩栩然蝴蝶也，自喻适志与！不知周也。俄然觉，则蘧蘧然周也。不知周之梦为蝴蝶与，蝴蝶之梦为周与？周与蝴蝶，则必有分矣。此之谓物化。",
        "吾生也有涯，而知也无涯。以有涯随无涯，殆已！已而为知者，殆而已矣。",
        "井蛙不可以语于海者，拘于虚也；夏虫不可以语于冰者，笃于时也；曲士不可以语于道者，束于教也。",
        "相濡以沫，不如相忘于江湖。与其誉尧而非桀也，不如两忘而化其道。",
        "泉涸，鱼相与处于陆，相呴以湿，相濡以沫，不如相忘于江湖。",
        "至人无己，神人无功，圣人无名。",
    ]},
    # 孟子 - Mencius
    {"bookTitle": "孟子", "author": "孟子", "tags": ["philosophy", "chinese", "confucianism", "ancient", "ethics"], "language": "zh", "passages": [
        "孟子曰：「鱼，我所欲也；熊掌，亦我所欲也。二者不可得兼，舍鱼而取熊掌者也。生，亦我所欲也；义，亦我所欲也。二者不可得兼，舍生而取义者也。」",
        "天将降大任于是人也，必先苦其心志，劳其筋骨，饿其体肤，空乏其身，行拂乱其所为，所以动心忍性，曾益其所不能。",
        "孟子曰：「民为贵，社稷次之，君为轻。」",
        "尽信书，则不如无书。",
        "孟子曰：「人之所不学而能者，其良能也；所不虑而知者，其良知也。」",
        "穷则独善其身，达则兼善天下。",
        "老吾老以及人之老，幼吾幼以及人之幼。",
    ]},
    # 史记 - Records of the Grand Historian
    {"bookTitle": "史记", "author": "司马迁", "tags": ["history", "chinese", "biography", "ancient", "classic"], "language": "zh", "passages": [
        "燕雀安知鸿鹄之志哉！",
        "王侯将相宁有种乎？",
        "桃李不言，下自成蹊。",
        "人固有一死，或重于泰山，或轻于鸿毛，用之所趋异也。",
        "大行不顾细谨，大礼不辞小让。",
        "运筹策帷帐之中，决胜于千里之外。",
        "飞鸟尽，良弓藏；狡兔死，走狗烹。",
    ]},
    # 红楼梦 - Dream of the Red Chamber
    {"bookTitle": "红楼梦", "author": "曹雪芹", "tags": ["fiction", "chinese", "romance", "classic", "family"], "language": "zh", "passages": [
        "满纸荒唐言，一把辛酸泪。都云作者痴，谁解其中味？",
        "世事洞明皆学问，人情练达即文章。",
        "假作真时真亦假，无为有处有还无。",
        "一个是阆苑仙葩，一个是美玉无瑕。若说没奇缘，今生偏又遇着他；若说有奇缘，如何心事终虚化？",
        "机关算尽太聪明，反算了卿卿性命。",
        "好风凭借力，送我上青云。",
        "质本洁来还洁去，强于污淖陷渠沟。",
    ]},
    # 三国演义 - Romance of the Three Kingdoms
    {"bookTitle": "三国演义", "author": "罗贯中", "tags": ["fiction", "chinese", "historical", "war", "classic"], "language": "zh", "passages": [
        "话说天下大势，分久必合，合久必分。",
        "滚滚长江东逝水，浪花淘尽英雄。是非成败转头空。青山依旧在，几度夕阳红。",
        "夫英雄者，胸怀大志，腹有良谋，有包藏宇宙之机，吞吐天地之志者也。",
        "鞠躬尽瘁，死而后已。",
        "勿以恶小而为之，勿以善小而不为。",
        "既生瑜，何生亮。",
        "良禽择木而栖，贤臣择主而事。",
    ]},
    # 西游记 - Journey to the West
    {"bookTitle": "西游记", "author": "吴承恩", "tags": ["fiction", "chinese", "fantasy", "adventure", "classic"], "language": "zh", "passages": [
        "混沌未分天地乱，茫茫渺渺无人见。自从盘古破鸿蒙，开辟从兹清浊辨。",
        "世上无难事，只怕有心人。",
        "山高自有客行路，水深自有渡船人。",
        "心生，种种魔生；心灭，种种魔灭。",
        "人心生一念，天地悉皆知。善恶若无报，乾坤必有私。",
        "三年不上门，当亲也不亲。",
        "皇帝轮流做，明年到我家。",
    ]},
    # 水浒传 - Water Margin
    {"bookTitle": "水浒传", "author": "施耐庵", "tags": ["fiction", "chinese", "historical", "rebellion", "classic"], "language": "zh", "passages": [
        "万事不由人计较，一生都是命安排。",
        "经目之事，犹恐未真；背后之言，岂能全信？",
        "急来拖佛脚，闲时不烧香。",
        "有缘千里来相会，无缘对面不相逢。",
        "画龙画虎难画骨，知人知面不知心。",
        "酒乱性，色迷人。",
        "量大福也大，机深祸亦深。",
    ]},
    # 孙子兵法 (already have Art of War in English, add Chinese version)
    {"bookTitle": "孙子兵法", "author": "孙武", "tags": ["philosophy", "chinese", "strategy", "military", "ancient"], "language": "zh", "passages": [
        "兵者，国之大事，死生之地，存亡之道，不可不察也。",
        "知己知彼，百战不殆；不知彼而知己，一胜一负；不知彼，不知己，每战必殆。",
        "上兵伐谋，其次伐交，其次伐兵，其下攻城。",
        "兵者，诡道也。故能而示之不能，用而示之不用，近而示之远，远而示之近。",
        "不战而屈人之兵，善之善者也。",
        "兵无常势，水无常形。能因敌变化而取胜者，谓之神。",
        "善战者，求之于势，不责于人。",
    ]},
    # 诗经 - Book of Songs
    {"bookTitle": "诗经", "author": "佚名", "tags": ["poetry", "chinese", "ancient", "love", "classic"], "language": "zh", "passages": [
        "关关雎鸠，在河之洲。窈窕淑女，君子好逑。",
        "蒹葭苍苍，白露为霜。所谓伊人，在水一方。",
        "桃之夭夭，灼灼其华。之子于归，宜其室家。",
        "昔我往矣，杨柳依依。今我来思，雨雪霏霏。",
        "知我者，谓我心忧；不知我者，谓我何求。",
        "投我以桃，报之以李。",
        "死生契阔，与子成说。执子之手，与子偕老。",
    ]},
    # 唐诗三百首精选 - Tang Poetry
    {"bookTitle": "唐诗三百首", "author": "李白/杜甫/王维等", "tags": ["poetry", "chinese", "tang-dynasty", "classic", "lyrical"], "language": "zh", "passages": [
        "床前明月光，疑是地上霜。举头望明月，低头思故乡。——李白《静夜思》",
        "君不见黄河之水天上来，奔流到海不复回。君不见高堂明镜悲白发，朝如青丝暮成雪。——李白《将进酒》",
        "国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。——杜甫《春望》",
        "空山新雨后，天气晚来秋。明月松间照，清泉石上流。——王维《山居秋暝》",
        "春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。——孟浩然《春晓》",
        "千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。——柳宗元《江雪》",
        "海内存知己，天涯若比邻。——王勃《送杜少府之任蜀州》",
    ]},
    # 宋词精选 - Song Dynasty Ci Poetry
    {"bookTitle": "宋词精选", "author": "苏轼/李清照/辛弃疾等", "tags": ["poetry", "chinese", "song-dynasty", "classic", "lyrical"], "language": "zh", "passages": [
        "明月几时有，把酒问青天。不知天上宫阙，今夕是何年。——苏轼《水调歌头》",
        "大江东去，浪淘尽，千古风流人物。——苏轼《念奴娇·赤壁怀古》",
        "寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。——李清照《声声慢》",
        "花自飘零水自流，一种相思，两处闲愁。此情无计可消除，才下眉头，却上心头。——李清照《一剪梅》",
        "醉里挑灯看剑，梦回吹角连营。八百里分麾下炙，五十弦翻塞外声。——辛弃疾《破阵子》",
        "众里寻他千百度，蓦然回首，那人却在灯火阑珊处。——辛弃疾《青玉案·元夕》",
        "无可奈何花落去，似曾相识燕归来。小园香径独徘徊。——晏殊《浣溪沙》",
    ]},
]

with open("src/data/passages.json") as f:
    data = json.load(f)

next_id = max(int(p["id"]) for p in data) + 1

added = 0
for book in CHINESE_PASSAGES:
    for text in book["passages"]:
        data.append({
            "id": str(next_id),
            "text": text,
            "bookTitle": book["bookTitle"],
            "author": book["author"],
            "tags": book["tags"],
            "language": book["language"],
        })
        next_id += 1
        added += 1

with open("src/data/passages.json", "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Added {added} Chinese passages. Total: {len(data)}")
