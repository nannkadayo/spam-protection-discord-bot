// Response for Uptime Robot
const http = require('http');
const fs = require('fs');
const readlineSync = require('readline-sync');
const { Client, Events, GatewayIntentBits, Intents, EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const Keyv = require('keyv');
const botconfig = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const punishments = new Keyv('sqlite://data.db' ,{ table: 'points' })
const db = new Keyv('sqlite://data.db', { table: 'bans' })
http.createServer(function (request, response) {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Discord bot is active now \n');
}).listen(3000);
function checkStringInArray(str, array) {
  return array.includes(str);
}
//const client = new Client();
//client.commands = new Collection();
const log = (botconfig.log)//logを送信するid
const token = (botconfig.token)//token
const banmaxpoint = (botconfig.banmaxpoint)

// Discord bot implements
const discord = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

const signale = require('signale');
const startTime = performance.now();
signale.start('起動を開始しました')

client.on('ready', async message => {
  await client.application.commands
    .set(
      [
        new SlashCommandBuilder()
          .setName('point')
          .setDescription('荒らし対策botの違反点数設定')
          .addUserOption((option) =>
            option
              .setName('user')
              .setDescription('ユーザー名')
              .setRequired(true))
          .addNumberOption((option) =>
            option
              .setDescription('点数')
              .setName('point')
              .setRequired(true)),
        new SlashCommandBuilder()
          .setName('gban')
          .setDescription('荒らし対策botのgban')
          .addUserOption((option) =>
            option
              .setName('user')
              .setDescription('ユーザー名')
              .setRequired(true)),
        new SlashCommandBuilder()
          .setName('check')
          .setDescription('荒らし対策botのポイント確認')
          .addUserOption((option) =>
            option
              .setName('user')
              .setDescription('ユーザー名')
              .setRequired(true)),
              new SlashCommandBuilder()
          .setName('syncing')
          .setDescription('荒らし対策botのグローバルban同期'),
          new SlashCommandBuilder()
          .setName('pardon')
          .setDescription('荒らし対策botのgban解除')
          .addUserOption((option) =>
            option
              .setName('user')
              .setDescription('ユーザー名')
              .setRequired(true)),
         // new SlashCommandBuilder()
          //.setName('banlist')
          //.setDescription('荒らし対策botのbanlist'),
              
      ].map((command) => command.toJSON())
    )
    .then(() => signale.await('スラッシュコマンド登録中...'));
  signale.success('スラッシュコマンド登録完了。');
  const endTime = performance.now();
  signale.success(`Botの起動が完了しました。${client.user.tag}でログイン中`);
  let time = endTime - startTime
  signale.note('起動時間' + time)
 
});



client.on(Events.InteractionCreate, async interaction => {
  const icon = interaction.member.user.avatarURL();
  const username = interaction.member.user.username;
  // avatar = interaction.user.avatarURL({ dynamic: true })
  if (!interaction.isChatInputCommand()) return;
  //if (interaction.commandName === 'banlist'){
    
  //}
  if (interaction.commandName === 'pardon'){
    pardonuser = interaction.options.getUser("user")
    pardonname = pardonuser.globalName
    pardonuser = pardonuser.id
    if (checkStringInArray(interaction.member.id, botconfig.admin)) {
      const isBanned = await db.get(pardonuser);
      if (isBanned) {
      UnBan(pardonuser)
      const embed = new EmbedBuilder()  //お知らせ
      .setTitle('荒らし対策')

      .setFields({ name: '結果', value: pardonname + 'をgban解除しました。' })
      .setColor(0x3cb371)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
    // interaction.reply({ content:appro + 'のポイントは' + userPunishments + 'です。', ephemeral: true })
      }
      else{
        const embed = new EmbedBuilder()  //お知らせ
        .setTitle('荒らし対策')
  
        .setFields({ name: 'エラー', value: pardonname + 'は、banされていません。' })
        .setColor(0xff0000)
        .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
        .setFooter({ name: "実行者", text: username, iconURL: icon });
      interaction.reply({ embeds: [embed] })
      }
    }
    else {
      //interaction.reply({ content: 'あなたは管理者として設定されていません', ephemeral: true })
      const embed = new EmbedBuilder()  //お知らせ
        .setTitle('荒らし対策')
        .setFields({ name: 'permission denied', value: 'あなたは管理者として設定されていません' })
        .setColor(0xff0000)
        .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
        .setFooter({ name: "実行者", text: username, iconURL: icon });
      interaction.reply({ embeds: [embed] })
    }
  }
  else if (interaction.commandName === 'syncing'){
   syncban()
   const embed = new EmbedBuilder()  //お知らせ
   .setTitle('荒らし対策')

   .setFields({ name: '結果', value: 'banを同期しました' })
   .setColor(0x3cb371)
   .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
   .setFooter({ name: "実行者", text: username, iconURL: icon });
 interaction.reply({ embeds: [embed] })
  }
  
  else if (interaction.commandName === 'gban') {
    if (checkStringInArray(interaction.member.id, botconfig.admin)) {
    gbanuser = interaction.options.getUser("user")
    const gbanname = gbanuser.globalName
    gbanuser = gbanuser.id
    if (checkStringInArray(!gbanuser, botconfig.admin)) {
    const isBanned = await db.get(gbanuser);
    if (!isBanned) {
    Ban(gbanuser)
    syncban()
    const embed = new EmbedBuilder()  //お知らせ
      .setTitle('荒らし対策')

      .setFields({ name: '結果', value: gbanname + 'をgbanしました。' })
      .setColor(0x3cb371)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
    // interaction.reply({ content:appro + 'のポイントは' + userPunishments + 'です。', ephemeral: true })
    }
    else{
      const embed = new EmbedBuilder()  //お知らせ
      .setTitle('荒らし対策')

      .setFields({ name: 'エラー', value: gbanname + 'は、既にbanされています' })
      .setColor(0xff0000)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
    }
  }else{
    const embed = new EmbedBuilder()  //お知らせ
      .setTitle('荒らし対策')
      .setFields({ name: 'permission denied', value: '管理者はban出来ません' })
      .setColor(0xff0000)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
  }
}
  else {
    //interaction.reply({ content: 'あなたは管理者として設定されていません', ephemeral: true })
    const embed = new EmbedBuilder()  //お知らせ
      .setTitle('荒らし対策')
      .setFields({ name: 'permission denied', value: 'あなたは管理者として設定されていません' })
      .setColor(0xff0000)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
  }
  }
  else if (interaction.commandName === 'check') {
    getuserpoint = interaction.options.getUser("user")
    
    //console.log(getuserpoint)
    appro = getuserpoint.globalName
    
    if(!getuserpoint.bot){
    getuserpoint = getuserpoint.id
    if (checkStringInArray(getuserpoint, botconfig.admin)) {
      state = (':white_check_mark:')
    }
    else {
      state = (':x: ')
    }
    //console.log(getuser)
    const userPunishments = await punishments.get(getuserpoint) || 0;
    const isBanned = await db.get(getuserpoint);
    if (isBanned) {
      banstate = (':white_check_mark:')
    }
    else {
      banstate = (':x: ')
    }
    const embed = new EmbedBuilder()
      .setTitle('荒らし対策')

      .setFields({ name: '結果', value: appro + 'のポイントは' + userPunishments + 'です。' }, { name: 'bot管理者？', value: state }, { name: 'gban?', value: banstate })
      .setColor(0x3cb371)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
    // interaction.reply({ content:appro + 'のポイントは' + userPunishments + 'です。', ephemeral: true })
  }else{
    botname = getuserpoint.username
    const embed = new EmbedBuilder()
      .setTitle('荒らし対策')

      .setFields({ name: 'エラー', value:botname + "はbotです。"})
      .setColor(0xff0000)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
  }
  }
  // interaction.reply({ content: '管理者は選択できません', ephemeral: true })


  else if (interaction.commandName === 'point') {
    namae = interaction.options.getUser("user")
    pointoo = interaction.options.getNumber("point")
    if(!namae.bot){
    if (checkStringInArray(interaction.member.id, botconfig.admin)) {


      //if (namae.permissions.has('Administrator')){
      //console.log(namae)
      if (pointoo < banmaxpoint) {
        const userId = namae.id;
        //namae = JSON.parse(userId)
        //namae = namae.id
        //console.log(namae)
        const newPunishments = pointoo;
        await punishments.set(userId, newPunishments); // 違反点数を保存
        const userPunishments = await punishments.get(userId) || 0;
        //interaction.reply({ content: '操作が完了しました', ephemeral: true })
        const embed = new EmbedBuilder()  //お知らせ
          .setTitle('荒らし対策')
          .setFields({ name: '完了', value: '操作が完了しました。' })
          .setColor(0x3cb371)
          .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
          .setFooter({ name: "実行者", text: username, iconURL: icon });
        interaction.reply({ embeds: [embed] })

      }
      else {
        // interaction.reply({ content: '10未満に設定してください', ephemeral: true })
        const embed = new EmbedBuilder()  //お知らせ
          .setTitle('荒らし対策')
          .setFields({ name: 'エラー', value: banmaxpoint + '未満に設定してください。' })
          .setColor(0xffa000)
          .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
          .setFooter({ name: "実行者", text: username, iconURL: icon });
        interaction.reply({ embeds: [embed] })
      }
    }
    else {
      //interaction.reply({ content: 'あなたは管理者として設定されていません', ephemeral: true })
      const embed = new EmbedBuilder()  //お知らせ
        .setTitle('荒らし対策')
        .setFields({ name: 'permission denied', value: 'あなたは管理者として設定されていません' })
        .setColor(0xff0000)
        .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
        .setFooter({ name: "実行者", text: username, iconURL: icon });
      interaction.reply({ embeds: [embed] })
    }
  }else{
    botname = namae.username
    const embed = new EmbedBuilder()
      .setTitle('荒らし対策')

      .setFields({ name: 'エラー', value:botname + "はbotです。"})
      .setColor(0xff0000)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
  }
}
  //else{
  //interaction.reply({ content: '管理者は選択できません', ephemeral: true })
  //}
  //}
});
client.on('messageCreate', async message => {
  const icon = message.member.user.avatarURL();
  if (message.content.match(/test!|しね|ころす|死ね|殺す|きっしょ|ゴミ|野獣先輩|糞|カス|消えろ|生きる価値なし|きえろ|fuck|fxxk|ファック|ふぁっく/)) {  //悪いものがないか探る
    if (message.author.bot) return;
    if (message.member.permissions.has('Administrator')) {
      messageas = message.content
      const username = message.member.user.username;
      console.log(message.content + "を削除しました")
      const embed = new EmbedBuilder()  //お知らせ
        .setTitle('荒らし対策')
        .setFields({ name: '報告', value: '不適切な表現が検出されました。' }, { name: '内容:', value: messageas })
        .setColor(0xffa000)
        .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
        .setFooter({ name: "実行者", text: username, iconURL: icon });
      log.forEach(function (element) {
        client.channels.cache.get(element).send({ embeds: [embed] })
      });
      //client.channels.cache.get(log).send({ embeds: [embed] })
      // message.reply({ embeds: [embed] })
      message.delete(100)  //message delete
    }
    else {
      messageas = message.content
      username = message.author.username  //違反点数を与える(beta)

      point(message, 1, client, 0xffa000, '不適切な表現が検出されました。違反点数を1ポイント付与しました')
      message.delete(100)  //message delete
    }
  }
})
client.on('messageCreate', async message => {
  if (message.content.match(/[a-zA-Z0-9_-]{23,28}\.[a-zA-Z0-9_-]{6,7}\.[a-zA-Z0-9_-]{27}/)) { // tokenの検知
    if (message.author.bot) return;
    member = message.member
    const icon = message.member.user.avatarURL();
    const username = message.member.user.username;
    messageas = message.content
    if (message.member.permissions.has('Administrator')) {     //adminの時
      console.log(username + 'をtimeoutできませんでした。ですがtoken削除を実行しました')

      const embed = new EmbedBuilder()  //お知らせ
        .setTitle('荒らし対策')
        .setFields({ name: '報告', value: 'timeoutできませんでした。ですがtoken削除を実行しました' }, { name: "内容", value: messageas })
        .setColor(0xffa000)
        .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
        .setFooter({ name: "実行者", text: username, iconURL: icon });
      //client.channels.cache.get(log).send({ embeds: [embed] })
      log.forEach(function (element) {
        client.channels.cache.get(element).send({ embeds: [embed] })
      });
      //message.reply({ embeds: [embed] })
      message.delete(100)
    }
    else {
      member = message.member
      username = message.author.username
      member.timeout(60_000, "tokenの送信");
      //await member.ban()

      console.log(username + "から、tokenの送信が検出されました")
      point(message, 5, client, 0xffa000, 'tokenを検知しました。timeoutを60秒セットしました。違反点数を5ポイント付与しました',)
      message.delete(100)
    }
  }
}
)

client.on('guildMemberAdd', async member => {
  if (!member.permissions.has('Administrator')) {
    if (await db.get(member.user.id)) {
      await member.ban({ reason: 'Global Ban' });
    }
  }
  else {
    console.log('サーバーの管理者である可能性があります')
  }
});

client.on('guildCreate', (guild) => {
  // ボットが新しいサーバーに参加した場合、グローバルbanをチェックします

  guild.members.fetch().then((members) => {
    members.forEach(async (membersa) => {
      if (!guild.permissions.has('Administrator')) {
        const isBanned = await db.get(membersa.id);
        if (isBanned) {
          membersa.ban({ reason: 'グローバルbanされているユーザーです。' });
        }
      }
      else {
        console.log('サーバーの管理者である可能性があります')
      }
    });
  });
});


async function point(message, poi, client, color, naiyou) {
  messageas = message.content
  //username = message.author.username
  const icon = message.member.user.avatarURL();
  const username = interaction.member.user.username;
  if (message.author.bot) return; // ボットのメッセージは無視する

  const userId = message.author.id;
  const userPunishments = await punishments.get(userId) || 0; // ユーザーの違反点数を取得（ない場合は0にする）
  const newPunishments = userPunishments + poi; // 違反点数を1増やす
  await punishments.set(userId, newPunishments); // 違反点数を保存
  const embed = new EmbedBuilder()  //お知らせ
    .setTitle('荒らし対策')
    .setFields({ name: '報告', value: naiyou }, { name: '内容:', value: messageas }, { name: '違反点数', value: newPunishments + "/10" })
    .setColor(color)
    .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
    .setFooter({ name: "名前", text: username, iconURL: icon });
  // client.channels.cache.get(log).send({ embeds: [embed] })
  // message.reply({ embeds: [embed] })
  log.forEach(function (element) {
    client.channels.cache.get(element).send({ embeds: [embed] })
  });

  if (newPunishments >= banmaxpoint) {
    console.log(username + "を、gbanしました。")
    Ban(userId);
    syncban()
    await punishments.delete(userId); // 違反点数をリセット
    const embed = new EmbedBuilder()  //お知らせ
      .setTitle('荒らし対策')
      .setFields({ name: '報告', value: '違反点数の超過でgbanしました。' })
      .setColor(0xff0000)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "名前", text: username, iconURL: icon });
    //client.channels.cache.get(log).send({ embeds: [embed] })
    //message.reply({ embeds: [embed] })
    log.forEach(function (element) {
      client.channels.cache.get(element).send({ embeds: [embed] })
    });
    return;
  }
}
function dm(id,naiyou){
  const user = client.users.cache.get(id)
	user.send({ embeds:[naiyou]})
}
function syncban(){
  client.guilds.cache.forEach(g => { // Botが参加しているすべてのサーバーで実行
    try {
      g.members.fetch().then((memberss) => {
        memberss.forEach(async (membersa) => {
            const isBanned = await db.get(membersa.id);
            if (isBanned) {
              membersa.ban({ reason: 'グローバルbanされているユーザーです。' });
          }
        });
      });
    } catch(e) {
      console.log(g.name + e + ": error")
    }})
}
//function syncunban(){
 // client.guilds.cache.forEach(g => { // Botが参加しているすべてのサーバーで実行
   // try {
     // g.members.fetch().then((memberss) => {
      //  memberss.forEach(async (membersa) => {
          //  const isBanned = await db.get(membersa.id);
          //  if (!isBanned) {
            //  g.members.unban(membersa.id);
         // }
      //  });
     // });
  //  } catch(e) {
  //    console.log(g.name + e + ": error")
  //  }})
//}


async function Ban(userId) {
  await db.set(userId, true);
}

async function UnBan(userId) {
  await db.set(userId, false);
}

client.login(token);

