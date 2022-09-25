const body = document.querySelector('body')
//add theme value to body
document.querySelector("body").classList.add(localStorage.getItem("theme")),
	
//stick navbar actions when page scrool down				
window.addEventListener('scroll', function() {
	if (window.scrollY > 68) {
		document.querySelector(".skyall").classList.add("space")
		document.querySelector(".tops").classList.add("fixed")
	}
	if (window.scrollY < 68) {
		document.querySelector(".tops").classList.remove("fixed")
		document.querySelector(".skyall").classList.remove("space")
	}
})

//handle click sounds
let snd1 = new Audio("assets/sound/s1.mp3")
let snd2 = new Audio("assets/sound/s2.mp3")

function play1() {
	snd1.play()
	snd1.volume = 0.35
}

function play2() {
	snd2.play()
	snd2.volume = 0.35
}

$(document).ready(function() {

	$('body').on('click', '.snd1', function(){	
		play1()
	})

	$('body').on('click', '.snd2', function(){
		play2()
	})


	const to = localStorage.getItem("isViewed") === null ? 1500 : 300
	setTimeout(function() {
		$('#loader').hide(0)
		$('#all').show(0)
	}, to)

	//restrict unwanted values in inputs
	$('body').on("keyup", "input", function(){
		let type = $(this).attr('char-type')

		if (type == 'numeric') {
			var reg = /[^0-9.]/g
		}
		else if (type == 'alpha') {
			var reg = /[^A-Za-z ]/g
		}

		$(this).val($(this).val().replaceAll(reg, ''))
	})
})

//if app has been viewed for the first time
localStorage.setItem("isViewed", "1")

//hide all logs
console.log = () => {}
console.warn = () => {}

Vue.createApp({
	data() {
		return {
			showAddDialogue: false,
			showDeleteDialogue: false,
			showInfoDialogue: false,
			showEdit: false,
			showHomeBtn: false,
			showAddMeasure: false,
			showAlert: false,
			showCopy: false,
			scrollPosition: 0,
			showCustomerList: true,

			customerInput: {
				name: '',
				phone: '',
				gender: '',
				id: ''
			},

			customer: [],

			editInfo: [{
				name: '',
				phone: '',
				gender: '',
				id: null,
				date: '',
				color: null,
				random: null
			}],

			searchVal: '',

			activeMeasure: [],

			addMeasureInput: ''
		}
	},


	methods: {
		showAdd() {
			this.showAddDialogue = true
		},


		addCustomer() {
			let elRand = Math.floor(Math.random() * 67096360784258824937)
			let colorRand = Math.floor(Math.random() * 16)

			if(this.customer.length > 1) {
				if(this.customer[0].color === colorRand || this.customer[1].color === colorRand) {
					rand = Math.floor(Math.random() * 16)
				}
			}

			let newValues = {
				name: this.customerInput.name,
				phone: this.customerInput.phone.length < 1 ? 'No Phone' : this.customerInput.phone,
				gender: this.customerInput.gender,
				date: moment().format('MMM Do YYYY, h:m a'),
				time: moment().unix(),
				color: colorRand,
				random: elRand
			}

			//first validate inputs
			if(this.customerInput.name.length > 1 && this.customerInput.gender.length > 1) {

				if(this.customer.push(newValues)) {
					play2()
					this.customer = this.customer.sort((a,b) =>  b.time - a.time)
					localStorage.setItem("customers", JSON.stringify(this.customer))
					
					//clear inputs
					this.customerInput.name = ''
					this.customerInput.phone = ''
					this.customerInput.gender = ''

					//scroll page up and go home
					this.showCustomerList = true
					this.showEdit = false
					this.showHomeBtn = false
					body.scrollTop = 0
					this.showAddDialogue = false

					//adding predefined measurement data for user
					let basicMeasure = [
						{ name: 'Shoulder', value: '', customer: elRand, id: Math.floor(Math.random() * 96385520845289352678), showDel: false, count: 0 },
						{ name: 'Arm Length', value: '', customer: elRand, id: Math.floor(Math.random() * 96385520845289352678), showDel: false, count: 1 },
						{ name: 'Waist', value: '', customer: elRand, id: Math.floor(Math.random() * 96385520845289352678), showDel: false, count: 2 },
						{ name: 'Neck', value: '', customer: elRand, id: Math.floor(Math.random() * 96385520845289352678), showDel: false, count: 3 },
						{ name: 'Boast', value: '', customer: elRand, id: Math.floor(Math.random() * 96385520845289352678), showDel: false, count: 4 }
					]

					const measureData = localStorage.getItem("measurements"+elRand)
					if(measureData === null) {
						localStorage.setItem("measurements"+elRand, JSON.stringify(basicMeasure))
					} else {
						let tempMeasure = JSON.parse(measureData)
						basicMeasure.forEach((element) => {
							tempMeasure.push(element)
						})
						
						//convert to string then push to localstorage
						localStorage.setItem("measurements"+elRand, JSON.stringify(tempMeasure))
					}
				}
			}
		},


		edit(id,name,phone,gender,date,time,color,random) {
			this.showCustomerList = false
			this.showEdit = true

			//set the customer info
			this.editInfo.name = name
			this.editInfo.phone = phone
			this.editInfo.gender = gender
			this.editInfo.date = date
			this.editInfo.time = time
			this.editInfo.color = color
			this.editInfo.random = random

			//set the customer measurement data
			let storedMeasure = JSON.parse(localStorage.getItem("measurements"+random))
			this.activeMeasure = storedMeasure

			this.showHomeBtn = true
			this.scrollPosition = body.scrollTop
			body.scrollTop = 0
		},


		saveMeasure(customerId) {
			this.showAlert = true
			setTimeout(() => this.showAlert = false, 5000)
			localStorage.setItem("measurements"+customerId, JSON.stringify(this.activeMeasure))
		},


		addMeasure(customerId) {
			if(this.addMeasureInput.length > 0) {
				let generateId = Math.floor(Math.random() * 96385520845289352678)//random unique <[*_*]> id for customer.

				this.activeMeasure.push({
					name: this.addMeasureInput,
					value: '',
					customer: customerId,
					id: generateId,
					showDel: false,
					count: this.activeMeasure.length
				})

				this.addMeasureInput = ''
				this.showAddMeasure = false
			}
		},


		deleteCustomer(rand) {
			const allCustomers = JSON.parse(localStorage.getItem("customers"))
			this.customer = this.customer.filter((e) => e.random !== rand)
			localStorage.setItem("customers", JSON.stringify(this.customer))

			//remove customer measurements
			localStorage.removeItem("measurements"+rand)

			setTimeout(() => this.showCustomerList = true, 200)
			this.showDeleteDialogue = false
			this.showEdit = false
			this.showHomeBtn = false
		},


		goHome() {
			this.showEdit = false
			setTimeout(() => this.showCustomerList = true, 300)
			this.showHomeBtn = false

			setTimeout(() => {
				body.scrollTop = this.scrollPosition
			}, 300)
		},


		search() {
			this.showCustomerList = true
			this.showEdit = false
			this.showHomeBtn = false

			let val = $('#sch').val().toLowerCase()

			if (val.length > 0) {
		      //iterate through all <customer list> elements
		      $(".list").each(function (i) {
		        //get contents of <customer list> and then lowerCase string to compare with lowerCase(d) search input
		        if ($(this).find('.name').html().toLowerCase().startsWith(val)) {
		          //if the contents of the current <customer list> matches with input value, get the id
		          let id = $(this).attr("id")
		          //then scroll to the <customer list> element
		          let list = document.querySelector("#" + id)
		          body.scrollTop = list.offsetTop + 65

		          //sart from scroll position to another matched list
		          return false;
		        }
		      });
		    } else {
		    	//if input becomes empty scroll top
		    	body.scrollTop = 0;
		    }
		},


		hideInfo() {
			this.showInfoDialogue = false
			play2()
		},


		theme() {
			if (body.classList.value == "" || body.classList.value == "light" || body.classList.value == "null") {
				body.className = ''
				localStorage.setItem("theme", "dark")
				body.classList.add("dark")
			}
			
			else if (body.classList.value == "dark") {
				body.className = ''
				localStorage.setItem("theme", "light")
				body.classList.add("light")
			}
		}
	},


	mounted() {

		if(localStorage.getItem("customers") === null) {
			//do nothing..
		} else {
			JSON.parse(localStorage.getItem("customers")).forEach((element) => {
				this.customer.push(element)
			})
		}

	}
}).mount("#app")