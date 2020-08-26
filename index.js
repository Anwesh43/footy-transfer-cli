#!/usr/bin/env node
const {consumer_key, consumer_secret, access_token_key, access_token_secret} = require('./credentials.json')
const {readFileSync} = require('fs')
const Twitter = require('twitter')

const client = new Twitter({consumer_key, consumer_secret, access_token_key, access_token_secret})
const endPoint = 'statuses/user_timeline'
const limit = 6

const getStatusPromise = (screen_name) => {
    return new Promise((resolve, reject) => {
        client.get(endPoint, {screen_name}, (err, tweets) => {
            if (err == null) {
                resolve(tweets.splice(0, limit))
            } else {
                reject(tweets)
            }
        })
    })
}

const getStatus = async (screen_name) => {
    try {
        const tweets = await getStatusPromise(screen_name)
        const lines =  tweets.map(tweet => tweet.text).join("\n\n")
        return lines 
    } catch(err) {
        console.log(err)
    }
}

const getNews = async (club) => {
    try {
        const data = readFileSync(`${club}_reliability.json`).toString()
        const json = JSON.parse(data)
        Object.keys(json).forEach(async (key) => {
            const result = await getStatus(json[key])
            console.log(`${key}:\n${result}\n\n`)
        })
    } catch(err) {
        console.log("err")
    }
}

if (process.argv.length == 3) {
    getNews(process.argv[2])
} else {
    console.log("Please enter one of the following club names");
    console.log("arsenal");
}