var express = require('express')
var router = express.Router()

const Translation = require('../domain/Translation')

const FakeStore = require('../infrastructure/store/fake')
const AppService = require('../app/AppService')

const store = new FakeStore({
  terms: [],
  translations: [],
})

const appService = new AppService(store)

router.post('/', function (req, res) {
  const newTerm = req.body
  const termId = appService.addTerm(newTerm)
  res.redirect(`./${termId}`)
})

router.get('/new', function (req, res) {
  res.render('./term/new')
})

router.get('/:id', function (req, res) {
  const term = appService.getTerm(req.params.id)
  const translations = appService.listTranslations(req.params.id)
  res.render('./term/_id', { term: { ...term, translations } })
})

router.post('/:id', function (req, res) {
  const translation = new Translation({
    id: 2, // should be a UUID
    termId: req.params.id,
    value: req.body.translation,
  })
  appService.addTranslation(translation)
  const term = appService.getTerm(req.params.id)
  const translations = appService.listTranslations(req.params.id)
  res.render('./term/_id', { term: { ...term, translations } })
})

module.exports = router
