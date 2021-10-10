const { Router } = require("express");
const router = Router()
const User = require('../models/User')
const config = require('config')
const bcrypt = require('bcryptjs')
const {check,validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')

// /api/auth/register
router.post(

'/register',

[
	check('email','некоректный email').isEmail(),
	check('password','минимальная длинна пароля 6 символов, только цифры или латинские символы')
	.isLength({min:6})
], 

async(req,res)=>{
	try {
		
		const err = validationResult(req)

		if(!err.isEmpty()){
			return res.status(400).json({
				err:err.array(),
				message:'некорректные данные при регистрации'
			})
		}

		const{email, password} = req.body

		const candidate = await User.findOne({email})

		if(candidate){
			return res.status(400).json({message:'такой пользователь уже существует'})
		}

		const hashedPass = await bcrypt.hash(password,5)
		const user = new User({email, password:hashedPass})

		await user.save()
		res.status(201).json({message:'пользователь создан'})

	} catch (e) {
		res.status(500).json({message:'не работает'})
	}
})

// /api/auth/login
router.post('/login',
[
	check('email','введите корректный email').isEmail(),
	check('password','введите пароль').exists()
],
async(req,res)=>{
	try {
		const err = validationResult(req)

		if(!err.isEmpty()){
			return res.status(400).json({
				err:err.array(),
				message:'некорректные данные при входе'
			})
		}

		const{email, password} = req.body

		const user = await User.findOne({email})
			if(!user){
				return res.status(400).json({message:'пользователь не найден '})
			}

		const isMatch = await bcrypt.compare(password, user.password)
			if(!isMatch){
				return res.status(400).json({message:'неверный пароль '})
			}
		
		const token = jwt.sign(
			{userId:user.id},
			config.get('jwtSecret'),
			{expiresIn:'1h'}
		)
		
		res.json({token, userId:user.id})
	

	} catch (e) {
		res.status(500).json({message:'не работает'})
	}
})

module.exports = router