require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Events,
  EmbedBuilder
} = require("discord.js");

const express = require("express");
const app = express();

// 🌐 กันหลับ (สำคัญ)
app.get("/", (req, res) => {
  res.send("Bot is running");
});
app.listen(3000, () => {
  console.log("Web server ready");
});

// 🤖 สร้างบอท
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// 🔴 ใส่โทเคนตรงนี้
client.login(process.env.TOKEN);

// 📌 ตอนบอทออนไลน์
client.once(Events.ClientReady, () => {
  console.log(`✅ บอทออนไลน์แล้ว`);
});

// 🎯 ระบบกดปุ่ม Verify
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "verify") {
    const role = interaction.guild.roles.cache.get("1126466174302044178");

    if (!role) {
      return interaction.reply({
        content: "❌ ไม่เจอยศ Member",
        ephemeral: true
      });
    }

    await interaction.member.roles.add(role);

    await interaction.reply({
      content: "✅ ยืนยันตัวตนสำเร็จ!",
      ephemeral: true
    });
  }
});

// 📩 ส่งปุ่ม Verify (ครั้งแรก)
client.once(Events.ClientReady, async () => {
  const channel = await client.channels.fetch("1126466175128326196");

  const embed = new EmbedBuilder()
    .setTitle("🔐 VERIFY")
    .setDescription("กดปุ่มด้านล่างเพื่อยืนยันตัวตน")
    .setColor("Green");

  const button = new ButtonBuilder()
    .setCustomId("verify")
    .setLabel("✅ Verify")
    .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder().addComponents(button);

  channel.send({
    embeds: [embed],
    components: [row]
  });
});

client.login(TOKEN);