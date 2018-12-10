import { WebClient } from '@slack/client'
import Octokit from '@octokit/rest'

exports.handler = async (event, context, callback) => {
  const body = JSON.parse(event.body)
  const slackEvent = body.event
  console.log(JSON.stringify(body, null, 4))
  console.log('aaaaaaaa')

  if (slackEvent && slackEvent.type === 'reaction_added' && slackEvent.item.type === 'message') {
      console.log('bbbbbbbb')
    const web = new WebClient(process.env.SLACK_TOKEN)
    const res = await web.conversations.history({
      latest: slackEvent.item.ts,
      limit: 1,
      channel: slackEvent.item.channel,
      inclusive: true
    })
    console.log('ooooooooooooooo')
    const message = res.messages[0]
    const octokit = Octokit()
    octokit.authenticate({
      type: 'oauth',
      token: process.env.GITHUB_TOKEN
    })

    const content = (new Buffer(message.text)).toString('base64')
    console.log('pppppppppppppppppppp')
    octokit.repos.createFile({
      owner: 'mottox2',
      repo: 'netlify-slack-app',
      path: `data/${slackEvent.item.ts}.txt`,
      message: 'Added by netlify-slack-app',
      content
    })
    
    
    console.log(JSON.stringify(message, null, 4))
    console.log('zzzzzzzzz')
  }

  callback(null, {
    statusCode: 200,
    body: body.challenge
  })
}
