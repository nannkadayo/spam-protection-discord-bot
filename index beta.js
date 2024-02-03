// Response for Uptime Robot
const http = require('http');
const { Client, Events, GatewayIntentBits, Intents, EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const Keyv = require('keyv');
const punishments = new Keyv('sqlite://point.sqlite');
http.createServer(function (request, response) {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Discord bot is active now \n');
}).listen(3000);
const log = ("")//logを送信するid
const token = ("")//token

// Discord bot implements
const discord = require('discord.js');
const { memoryUsage } = require('process');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const signale = require('signale');
client.on('ready',async message => {
  await client.application.commands
    .set(
      [
        new discord.SlashCommandBuilder()
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
              new discord.SlashCommandBuilder()
              .setName('list')
              .setDescription('荒らし対策botのポイント確認')
              .addUserOption((option) =>
              option
              .setName('user')
              .setDescription('ユーザー名')
              .setRequired(true))
      ].map((command) => command.toJSON())
    )  
    .then(() => signale.pending('スラッシュコマンド登録中...'));

    signale.success('スラッシュコマンド登録完了。');
    signale.success(`Botの起動が完了しました。\n${client.user.tag}でログイン中`);
  });
  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'list'){
    getuserpoint = interaction.options.getUser("user")
    getuserpoint = getuserpoint.id
    //console.log(getuser)
    const userPunishments = await punishments.get(getuserpoint) || 0;
    interaction.reply({content: 'ポイントは' + userPunishments + 'です。', ephemeral: true})
  }

  else if (interaction.commandName === 'point') {
      namae = interaction.options.getUser("user")
      pointoo = interaction.options.getNumber("point")
      //console.log(pointoo)
      if (pointoo < 10){
      const userId = namae.id;
      //namae = JSON.parse(userId)
      //namae = namae.id
      //console.log(namae)
      const newPunishments = pointoo;
      await punishments.set(userId, newPunishments); // 違反点数を保存
      const userPunishments = await punishments.get(userId) || 0;
      interaction.reply({content: '操作が完了しました', ephemeral: true})
      }
      else{
        interaction.reply({content: '10以上に設定することはできません', ephemeral: true})
      }
    }
  });
  client.on('messageCreate', async message => {
    if (message.content.match(/test!|しね|ころす|死ね|殺す|きっしょ|ゴミ|野獣先輩|糞|カス|消えろ|生きる価値なし|きえろ|fuck|fxxk|ファック|ふぁっく/)) {  //悪いものがないか探る
      if (message.member.permissions.has('Administrator')) {
        messageas = message.content
      message.delete(100)  //message delete
      console.log(message.content + "を削除しました")
      const embed = new EmbedBuilder()  //お知らせ
      .setTitle('荒らし対策')
      .setFields({ name: '報告', value: username + 'から不適切な表現が検出されました。' }, { name: '内容:', value: messageas })
      .setColor(0xffa000)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
    client.channels.cache.get(log).send({ embeds: [embed] })
      }
      else{
        messageas = message.content
        username = message.author.username  //違反点数を与える(beta)
        message.delete(100)
        point(message, 1, client, 0xffa000, 'から不適切な表現が検出されました。違反点数を1ポイント付与しました')
      }
  }})
client.on('messageCreate', async message => {
  if (message.content.match(/[a-zA-Z0-9_-]{23,28}\.[a-zA-Z0-9_-]{6,7}\.[a-zA-Z0-9_-]{27}/)) { // tokenの検知
    member = message.member
    username = message.author.username
    messageas = message.content
    if (message.member.permissions.has('Administrator')) {     //adminの時
      console.log(username + 'をtimeoutできませんでした。ですがtoken削除を実行しました')
      message.delete(100)
      const embed = new EmbedBuilder()  //お知らせ
      .setTitle('荒らし対策')
      .setFields({ name: '報告', value: username + 'をtimeoutできませんでした。ですがtoken削除を実行しました'} ,{name:"内容", value: messageas})
      .setColor(0xffa000)
      .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
      client.channels.cache.get(log).send({ embeds: [embed] })
    }
      else {
        member = message.member
        username = message.author.username
        member.timeout(60_000, "tokenの送信");
        //await member.ban()
        message.delete(100)
        console.log(username + "から、tokenの送信が検出されました")
        point (message, 5, client, 0xffa000, 'からtokenを検知しました。timeoutを60秒セットしました。違反点数を5ポイント付与しました',)
      }
    }
  }
)

async function point (message, poi, client ,color, naiyou){
  messageas = message.content
  username = message.author.username
if (message.author.bot) return; // ボットのメッセージは無視する

const userId = message.author.id;
const userPunishments = await punishments.get(userId) || 0; // ユーザーの違反点数を取得（ない場合は0にする）
const newPunishments = userPunishments + poi; // 違反点数を1増やす
await punishments.set(userId, newPunishments); // 違反点数を保存
const embed = new EmbedBuilder()  //お知らせ
.setTitle('荒らし対策')
.setFields({ name: '報告', value: username + naiyou}, { name: '内容:', value: messageas } ,{ name: '違反点数', value: newPunishments + "/10"})
.setColor(color)
.setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
client.channels.cache.get(log).send({ embeds: [embed] })
if (newPunishments >= 10) {
  console.log(username + "を、banしました。")
  message.guild.members.ban(userId, { reason: '違反点数の超過' });
  await punishments.delete(userId); // 違反点数をリセット
  const embed = new EmbedBuilder()  //お知らせ
  .setTitle('荒らし対策')
  .setFields({ name: '報告', value: username + 'を違反点数の超過でbanしました。'})
  .setColor(0xff0000)
  .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる
  client.channels.cache.get(log).send({ embeds: [embed] })
  return;
}
}





client.login(token);