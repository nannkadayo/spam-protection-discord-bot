// Response for Uptime Robot
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import botconfig from "./bot.config.js";
//const botconfig = require("./con.js");
const http = require('http');
const fs = require('fs');
const { Client, Events, GatewayIntentBits, Intents, EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const Keyv = require('keyv');
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
const log = (botconfig.botdata.log)//logを送信するid
const token = (botconfig.botdata.token)//token
const banmaxpoint = (botconfig.botdata.banmaxpoint)
const owner = (botconfig.botdata.owner)
const admin = (botconfig.botdata.admin)
const fatal = (botconfig.color.fatal)
const warn = (botconfig.color.warn)
const success = (botconfig.color.success)
const mybotname = (botconfig.botdata.botname)
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
          .setDescription(mybotname + 'の違反点数設定')
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
          .setDescription(mybotname + 'のgban')
          .addUserOption((option) =>
            option
              .setName('user')
              .setDescription('ユーザー名')
              .setRequired(true)),
        new SlashCommandBuilder()
          .setName('check')
          .setDescription(mybotname + 'のポイント確認')
          .addUserOption((option) =>
            option
              .setName('user')
              .setDescription('ユーザー名')
              .setRequired(true)),
              new SlashCommandBuilder()
          .setName('syncing')
          .setDescription(mybotname + 'のグローバルban同期'),
          new SlashCommandBuilder()
          .setName('pardon')
          .setDescription(mybotname + 'のgban解除')
          .addUserOption((option) =>
            option
              .setName('user')
              .setDescription('ユーザー名')
              .setRequired(true)),
         // new SlashCommandBuilder()
          //.setName('banlist')
          //.setDescription(mybotname + 'のbanlist'),

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
    var pardonuser = interaction.options.getUser("user")
    var pardonname = pardonuser.globalName
    const baskup = pardonuser
         var pardonuser = pardonuser.id
    if (checkStringInArray(interaction.member.id, admin)) {
      if(!baskup.bot){
      const isBanned = await db.get(pardonuser);
      if (isBanned) {
        if(!checkStringInArray(baskup.id, admin)){
      UnBan(pardonuser)
      const embed = new EmbedBuilder()  //お知らせ
      .setTitle(mybotname)

      .setFields({ name: '結果', value: pardonname + 'をgban解除しました。' })
      .setColor(success)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
    // interaction.reply({ content:appro + 'のポイントは' + userPunishments + 'です。', ephemeral: true })
      }
      else{
        const embed = new EmbedBuilder()  //お知らせ
        .setTitle(mybotname)

        .setFields({ name: 'エラー', value: pardonname + 'は、banされていません。' })
        .setColor(fatal)
        .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
        .setFooter({ name: "実行者", text: username, iconURL: icon });
      interaction.reply({ embeds: [embed] })
      }
    }
    else{
      const embed = new EmbedBuilder()  //お知らせ
      .setTitle(mybotname)
      .setFields({ name: 'エラー', value: '管理者は選択できません' })
      .setColor(fatal)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
    }
    }else{
       var botname = baskup.username
      const embed = new EmbedBuilder()
        .setTitle(mybotname)

        .setFields({ name: 'エラー', value:botname + "はbotです。"})
        .setColor(fatal)
        .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
        .setFooter({ name: "実行者", text: username, iconURL: icon });
      interaction.reply({ embeds: [embed] })
    }
    }
    else {
      //interaction.reply({ content: 'あなたは管理者として設定されていません', ephemeral: true })
      const embed = new EmbedBuilder()  //お知らせ
        .setTitle(mybotname)
        .setFields({ name: 'permission denied', value: 'あなたは管理者として設定されていません' })
        .setColor(fatal)
        .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
        .setFooter({ name: "実行者", text: username, iconURL: icon });
      interaction.reply({ embeds: [embed] })
    }
  }
  else if (interaction.commandName === 'syncing'){
    if (checkStringInArray(interaction.member.id, admin )) {

      syncban()
   const embed = new EmbedBuilder()  //お知らせ
   .setTitle(mybotname)

   .setFields({ name: '結果', value: 'banを同期しました' })
   .setColor(success)
   .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
   .setFooter({ name: "実行者", text: username, iconURL: icon });
 interaction.reply({ embeds: [embed] })
    }
    else{
      const embed = new EmbedBuilder()  //お知らせ
      .setTitle(mybotname)

      .setFields({ name: 'エラー', value: '管理者として設定されていません' })
      .setColor(fatal)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
    }
  }

  else if (interaction.commandName === 'gban') {
    if (checkStringInArray(interaction.member.id, admin)) {
    var gbanuser = interaction.options.getUser("user")
    const gbanname = gbanuser.globalName
    const bot = gbanuser.bot
    var gbanuser = gbanuser.id
    if (!checkStringInArray(gbanuser, admin)) {
      if(!bot){

    const isBanned = await db.get(gbanuser);
    if (!isBanned) {
    Ban(gbanuser)
    syncban()
    const embed = new EmbedBuilder()  //お知らせ
      .setTitle(mybotname)

      .setFields({ name: '結果', value: gbanname + 'をgbanしました。' })
      .setColor(success)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
    // interaction.reply({ content:appro + 'のポイントは' + userPunishments + 'です。', ephemeral: true })
    }
    else{
      const embed = new EmbedBuilder()  //お知らせ
      .setTitle(mybotname)

      .setFields({ name: 'エラー', value: gbanname + 'は、既にbanされています' })
      .setColor(fatal)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
    }
  }
  else{
    const embed = new EmbedBuilder()  //お知らせ
      .setTitle(mybotname)
      .setFields({ name: 'エラー', value: 'botはban出来ません' })
      .setColor(fatal)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
  }
  }else{
    const embed = new EmbedBuilder()  //お知らせ
      .setTitle(mybotname)
      .setFields({ name: 'permission denied', value: '管理者はban出来ません' })
      .setColor(fatal)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
  }
}
  else {
    //interaction.reply({ content: 'あなたは管理者として設定されていません', ephemeral: true })
    const embed = new EmbedBuilder()  //お知らせ
      .setTitle(mybotname)
      .setFields({ name: 'permission denied', value: 'あなたは管理者として設定されていません' })
      .setColor(fatal)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
  }
  }
  else if (interaction.commandName === 'check') {
    var getuserpoint = interaction.options.getUser("user")
    const checkicon = getuserpoint.avatarURL();
    //console.log(getuserpoint)
    var appro = getuserpoint.globalName

    if(!getuserpoint.bot){
    getuserpoint = getuserpoint.id
    var state = checkStringInArray(getuserpoint, admin)
    //console.log(getuser)
    const userPunishments = await punishments.get(getuserpoint) || 0;
    const isBanned = await db.get(getuserpoint);
    
    const embed = new EmbedBuilder()
      .setTitle(mybotname)
      .setAuthor({
        name: appro,
        iconURL: checkicon
      })
      .setFields({ name: '結果', value: 'ポイント' + userPunishments + '/'+ banmaxpoint }, { name: 'bot管理者？', value: state ? `> :white_check_mark:`: `> :x: `}, { name: 'gban?', value: isBanned ? `> :white_check_mark:`: `> :x: `})
      .setColor(success)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
    // interaction.reply({ content:appro + 'のポイントは' + userPunishments + 'です。', ephemeral: true })
  }else{
     var botname = getuserpoint.username
    const embed = new EmbedBuilder()
      .setTitle(mybotname)

      .setFields({ name: 'エラー', value:botname + "はbotです。"})
      .setColor(fatal)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      .setFooter({ name: "実行者", text: username, iconURL: icon });
    interaction.reply({ embeds: [embed] })
  }
  }
  // interaction.reply({ content: '管理者は選択できません', ephemeral: true })


  else if (interaction.commandName === 'point') {
     var namae = interaction.options.getUser("user")
     var pointoo = interaction.options.getNumber("point")
    if(!namae.bot){
    if (checkStringInArray(interaction.member.id, admin)) {
if(!checkStringInArray(namae.id, admin)){

      //if (namae.permissions.has('Administrator')){
      //console.log(namae)
      if (pointoo < banmaxpoint) {
        const userId = namae.id;
        //namae = JSON.parse(userId)
        //namae = namae.id
        //console.log(namae)
        const newPunishments = pointoo;
        const oldpo = await punishments.get(userId) || 0;
        await punishments.set(userId, newPunishments); // 違反点数を保存   
        const po = await punishments.get(userId) || 0; 
        const embed = new EmbedBuilder()  //お知らせ
          .setTitle(mybotname)
          .setFields({ name: '完了', value: '操作が完了しました。' },{ name: '結果', value:oldpo + '/' + banmaxpoint + '→' + po + '/' + banmaxpoint})
          .setColor(success)
          .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
          .setFooter({ name: "実行者", text: username, iconURL: icon });
        interaction.reply({ embeds: [embed] })

      }
      else {
        // interaction.reply({ content: '10未満に設定してください', ephemeral: true })
        const embed = new EmbedBuilder()  //お知らせ
          .setTitle(mybotname)
          .setFields({ name: 'エラー', value: banmaxpoint + '未満に設定してください。' })
          .setColor(warn)
          .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
          .setFooter({ name: "実行者", text: username, iconURL: icon });
        interaction.reply({ embeds: [embed] })
      }}
      else{
        const embed = new EmbedBuilder()  //お知らせ
        .setTitle(mybotname)
        .setFields({ name: 'エラー', value: '管理者は選択できません' })
        .setColor(fatal)
        .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
        .setFooter({ name: "実行者", text: username, iconURL: icon });
      interaction.reply({ embeds: [embed] })
      }
    }
    else {
      //interaction.reply({ content: 'あなたは管理者として設定されていません', ephemeral: true })
      const embed = new EmbedBuilder()  //お知らせ
        .setTitle(mybotname)
        .setFields({ name: 'permission denied', value: 'あなたは管理者として設定されていません' })
        .setColor(fatal)
        .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
        .setFooter({ name: "実行者", text: username, iconURL: icon });
      interaction.reply({ embeds: [embed] })
    }
  }else{
   var botname = namae.username
    const embed = new EmbedBuilder()
      .setTitle(mybotname)

      .setFields({ name: 'エラー', value:botname + "はbotです。"})
      .setColor(fatal)
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
  if (message.content.match(/test!|しね|ころす|死ね|sine|殺す|きっしょ|ゴミ|野獣先輩|糞|カス|消えろ|生きる価値なし|きえろ|fuck|fxxk|ファック|ふぁっく/)) {  //悪いものがないか探る
    if (message.author.bot || checkStringInArray(message.member.id, owner)) return;
    if (checkStringInArray(message.member.id, owner)) return;
    if (message.member.permissions.has('Administrator') || checkStringInArray(message.member.id, admin)) {
     var messageas = message.content
      const username = message.member.user.username;
      console.log(message.content + "を削除しました")
      const embed = new EmbedBuilder()  //お知らせ
        .setTitle(mybotname)
        .setFields({ name: '報告', value: '不適切な表現が検出されました。' }, { name: '内容:', value: messageas })
        .setColor(warn)
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
    var  messageas = message.content
     var username = message.author.username  //違反点数を与える(beta)

      point(message, 1, client, warn, '不適切な表現が検出されました。違反点数を1ポイント付与しました')
      message.delete(100)  //message delete
    }
  }
})
client.on('messageCreate', async message => {
  if (message.content.match(/[a-zA-Z0-9_-]{23,28}\.[a-zA-Z0-9_-]{6,7}\.[a-zA-Z0-9_-]{27}/)) { // tokenの検知
    if (message.author.bot || checkStringInArray(message.member.id, owner)) return;
   var member = message.member
    const icon = message.member.user.avatarURL();
    var username = message.member.user.username;
 var   messageas = message.content
    if (message.member.permissions.has('Administrator') || checkStringInArray(message.member.id, admin)) {     //adminの時
      console.log(username + 'をtimeoutできませんでした。ですがtoken削除を実行しました')

      const embed = new EmbedBuilder()  //お知らせ
        .setTitle(mybotname)
        .setFields({ name: '報告', value: 'timeoutできませんでした。ですがtoken削除を実行しました' }, { name: "内容", value: messageas })
        .setColor(warn)
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
     var member = message.member
     var username = message.author.username
      member.timeout(60_000, "tokenの送信");
      //await member.ban()

      console.log(username + "から、tokenの送信が検出されました")
      point(message, 5, client, warn, 'tokenを検知しました。timeoutを60秒セットしました。違反点数を5ポイント付与しました',)
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
        const isBanned = await db.get(membersa.id);
        if (isBanned) {
          if (!membersa.permissions.has('Administrator')) {
          membersa.ban({ reason: 'グローバルbanされているユーザーです。' });
          }else {
            console.log('サーバーの管理者である可能性があります')
          }
        }
    });
  });
});


async function point(message, poi, client, color, naiyou) {
 var messageas = message.content
  //username = message.author.username
  const icon = message.member.user.avatarURL();
  const username = interaction.member.user.username;
  if (message.author.bot) return; // ボットのメッセージは無視する

  const userId = message.author.id;
  const userPunishments = await punishments.get(userId) || 0; // ユーザーの違反点数を取得（ない場合は0にする）
  const newPunishments = userPunishments + poi; // 違反点数を1増やす
  await punishments.set(userId, newPunishments); // 違反点数を保存
  const embed = new EmbedBuilder()  //お知らせ
    .setTitle(mybotname)
    .setFields({ name: '報告', value: naiyou }, { name: '内容:', value: messageas }, { name: '違反点数', value: newPunishments + "/" + banmaxpoint })
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
      .setTitle(mybotname)
      .setFields({ name: '報告', value: '違反点数の超過でgbanしました。' })
      .setColor(fatal)
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
function embedsdm(id,naiyou){
  const user = client.users.cache.get(id)
  user.send({ embeds:[naiyou]})
}
function syncban(){
  client.guilds.cache.forEach(g => { // Botが参加しているすべてのサーバーで実行
    try {
      g.members.fetch().then((memberss) => {
        memberss.forEach(async (membersa) => {
         // console.log(membersa.id)
            const isBanned = await db.get(membersa.id);
            if (isBanned) {
              if (!membersa.permissions.has('Administrator')) {
              membersa.ban({ reason: 'グローバルbanされているユーザーです。' });
            }else{
              console.log('管理者である可能性があります')
            }
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