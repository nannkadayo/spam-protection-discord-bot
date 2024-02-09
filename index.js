// Response for Uptime Robot
const http = require('http');
const fs = require('fs');
const { Client, Events, GatewayIntentBits, Intents, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Keyv = require('keyv');
const botconfig = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const punishments = new Keyv('sqlite://point.sqlite');
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

// Discord bot implements
const discord = require('discord.js');
const { memoryUsage } = require('process');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

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
          .setName('check')
          .setDescription('荒らし対策botのポイント確認')
          .addUserOption((option) =>
            option
              .setName('user')
              .setDescription('ユーザー名')
              .setRequired(true)),
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
  username = interaction.user.username
 // avatar = interaction.user.avatarURL({ dynamic: true })
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'check') {
    getuserpoint = interaction.options.getUser("user")
    //console.log(getuserpoint)
    appro = getuserpoint.username
    getuserpoint = getuserpoint.id
    if (checkStringInArray(getuserpoint, botconfig.admin)){
      state = (':o: ')
    }
    else{
      state = (':x: ')
    }
    //console.log(getuser)
    const userPunishments = await punishments.get(getuserpoint) || 0;
    const embed = new EmbedBuilder()  //お知らせ
        .setTitle('荒らし対策')
        .setFields({ name: '結果', value: appro + 'のポイントは' + userPunishments +'です。' },{name:'bot管理者？', value: state},{name:'実行者', value: username})
        .setColor(0x3cb371)
        .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
        interaction.reply({ embeds: [embed] })
   // interaction.reply({ content:appro + 'のポイントは' + userPunishments + 'です。', ephemeral: true })
    }
   
     // interaction.reply({ content: '管理者は選択できません', ephemeral: true })
  
   
    else if (interaction.commandName === 'point') {
    namae = interaction.options.getUser("user")
    pointoo = interaction.options.getNumber("point")
    if (checkStringInArray(interaction.member.id, botconfig.admin)){

  
    
    //if (namae.permissions.has('Administrator')){
    //console.log(namae)
    if (pointoo < 10) {
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
        .setFields({ name: '完了', value: '操作が完了しました。' },{name:'実行者', value: username})
        .setColor(0x3cb371)
        .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
        interaction.reply({ embeds: [embed] })
  
    }
    else {
     // interaction.reply({ content: '10未満に設定してください', ephemeral: true })
      const embed = new EmbedBuilder()  //お知らせ
        .setTitle('荒らし対策')
        .setFields({ name: 'エラー', value:'10未満に設定してください。' },{name:'実行者', value: username})
        .setColor(0xffa000)
        .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      interaction.reply({ embeds: [embed] })
    }
  }
  else{
    //interaction.reply({ content: 'あなたは管理者として設定されていません', ephemeral: true })
    const embed = new EmbedBuilder()  //お知らせ
        .setTitle('荒らし対策')
        .setFields({ name: 'permission denied', value: 'あなたは管理者として設定されていません' },{name:'実行者', value: username})
        .setColor(0xffa000)
        .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      interaction.reply({ embeds: [embed] })
  }
}
  //else{
    //interaction.reply({ content: '管理者は選択できません', ephemeral: true })
  //}
//}
});
client.on('messageCreate', async message => {
  if (message.content.match(/test!|しね|ころす|死ね|殺す|きっしょ|ゴミ|野獣先輩|糞|カス|消えろ|生きる価値なし|きえろ|fuck|fxxk|ファック|ふぁっく/)) {  //悪いものがないか探る
    if (message.author.bot) return;
    if (message.member.permissions.has('Administrator')) {
      messageas = message.content
      username = message.author.username
      console.log(message.content + "を削除しました")
      const embed = new EmbedBuilder()  //お知らせ
        .setTitle('荒らし対策')
        .setFields({ name: '報告', value: username + 'から不適切な表現が検出されました。' }, { name: '内容:', value: messageas })
        .setColor(0xffa000)
        .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
        log.forEach(function(element){
          client.channels.cache.get(element).send({ embeds: [embed] })
        });
      //client.channels.cache.get(log).send({ embeds: [embed] })
     // message.reply({ embeds: [embed] })
      message.delete(100)  //message delete
    }
    else {
      messageas = message.content
      username = message.author.username  //違反点数を与える(beta)
     
      point(message, 1, client, 0xffa000, 'から不適切な表現が検出されました。違反点数を1ポイント付与しました')
      message.delete(100)  //message delete
    }
  }
})
client.on('messageCreate', async message => {
  if (message.content.match(/[a-zA-Z0-9_-]{23,28}\.[a-zA-Z0-9_-]{6,7}\.[a-zA-Z0-9_-]{27}/)) { // tokenの検知
    if (message.author.bot) return;
    member = message.member
    username = message.author.username
    messageas = message.content
    if (message.member.permissions.has('Administrator')) {     //adminの時
      console.log(username + 'をtimeoutできませんでした。ですがtoken削除を実行しました')
     
      const embed = new EmbedBuilder()  //お知らせ
        .setTitle('荒らし対策')
        .setFields({ name: '報告', value: username + 'をtimeoutできませんでした。ですがtoken削除を実行しました' }, { name: "内容", value: messageas })
        .setColor(0xffa000)
        .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      //client.channels.cache.get(log).send({ embeds: [embed] })
      log.forEach(function(element){
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
      point(message, 5, client, 0xffa000, 'からtokenを検知しました。timeoutを60秒セットしました。違反点数を5ポイント付与しました',)
      message.delete(100)
    }
  }
}
)

async function point(message, poi, client, color, naiyou) {
  messageas = message.content
  username = message.author.username
  if (message.author.bot) return; // ボットのメッセージは無視する

  const userId = message.author.id;
  const userPunishments = await punishments.get(userId) || 0; // ユーザーの違反点数を取得（ない場合は0にする）
  const newPunishments = userPunishments + poi; // 違反点数を1増やす
  await punishments.set(userId, newPunishments); // 違反点数を保存
  const embed = new EmbedBuilder()  //お知らせ
    .setTitle('荒らし対策')
    .setFields({ name: '報告', value: username + naiyou }, { name: '内容:', value: messageas }, { name: '違反点数', value: newPunishments + "/10" })
    .setColor(color)
    .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
 // client.channels.cache.get(log).send({ embeds: [embed] })
// message.reply({ embeds: [embed] })
log.forEach(function(element){
  client.channels.cache.get(element).send({ embeds: [embed] })
});
  if (newPunishments >= 10) {
    console.log(username + "を、banしました。")
    message.guild.members.ban(userId, { reason: '違反点数の超過' });
    await punishments.delete(userId); // 違反点数をリセット
    const embed = new EmbedBuilder()  //お知らせ
      .setTitle('荒らし対策')
      .setFields({ name: '報告', value: username + 'を違反点数の超過でbanしました。' })
      .setColor(0xff0000)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
    //client.channels.cache.get(log).send({ embeds: [embed] })
    //message.reply({ embeds: [embed] })
    log.forEach(function(element){
      client.channels.cache.get(element).send({ embeds: [embed] })
    });
    return;
  }
}






client.login(token);
