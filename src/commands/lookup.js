const { default: axios } = require("axios");
const dns = require('dns/promises');

module.exports = {
    name: 'lookup',
    description: "Lookup an IP address",
    run: async (client, message, args) => {
        try {
            let ip = args[0];
            if (!ip) return client.sendMessage(message.chat.id, "📍 Usage: `/lookup <ip or hostname>`\n\nℹ Example: `/lookup 1.1.1.1` or `/lookup google.com`", { parse_mode: 'MarkdownV2' });

            if (!ip.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
                try {
                    ip = (await dns.resolve(ip))[0];
                } catch (error) {
                    return client.sendMessage(message.chat.id, "📍 Invalid IP address or hostname.");
                }
            }

            const { data } = await axios.get(`https://ipwho.is/${ip}`);
            if (!data.success) return client.sendMessage(message.chat.id, "📍 Invalid IP address or hostname.");

            client.sendMessage(message.chat.id, `📍 IP Lookup for ${ip}\n\n\`\`\`Result:\n🌏 Country: ${data.flag?.emoji} ${data.country}\n🏝 Region: ${data.region}\n🏢 City: ${data.city}\n📫 Postal Code: ${data.postal}\n🔍 Coordinates: ${data.latitude}, ${data.longitude}\n📡 ISP: ${data.connection.isp}\n📶 ISP: ${data.connection.asn}\n🕓 Timezone: ${data.timezone.id} ${data.timezone.abbr} ${data.timezone.utc}\`\`\``, { parse_mode: 'Markdown' });

        } catch (error) {
            console.error(error);
            client.sendMessage(message.chat.id, "📍 An error occurred while processing your request.");
        }
    }
};