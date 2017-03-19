# Bot revolution workshop repository
This repository contains the code and getting started info for the Bot Revolution Workshop (Codemotion Rome 2017):

DATE: Thursday, 23rd of March  
TIME: 8:30 am to 6:00 pm  

## Prerequisites
- Have a laptop (Windows, Linux or Mac) with Node.js runtime > 6.10.0 installed. Find instructions available [here](https://nodejs.org/en/download/)
- Install the Bot Framework Emulator (Windows, Linux and Mac) from [here](https://emulator.botframework.com/)
- You need to run tunneling software so that your bot can accept incoming requests from the outside world when hosted in your computer behind a firewal. Install `ngrok` tunneling software from [here](https://ngrok.com/download)
- You need a Microsoft Live account if you want to connect your Bot to external channels (i.e. Skype, Telegram, Facebook, Slack, etc.) and to create your own Language Understanding Intelligent Service (LUIS) model. If you don't have a Microsoft account yet, go [here](https://login.live.com/it)
- For the channels you want your Bot to work on, you need a user account on each of them. We also suggest you to install the desktop applications for the major channels ([Skype](https://www.skype.com/download-skype/skype-for-computer/), [Telegram](https://telegram.org/apps#desktop-apps) and [Slack](https://slack.com/downloads)).
- For some deployment tests and examples we might use Microsoft Azure. We suggest you to create a free account on [Azure](https://azure.microsoft.com/it-it/free/) to build your own deploymenet environment.
- To speedup the setup phase, you might install the prerequisite Node.js packages in your local woking directory:
  * `npm init`
  * `npm install botbuilder restify dotenv-extended --save`
  * `npm install request request-promise system-sleep giphy-api forismatic-node lodash util applicationinsights mstranslator assert --save`
