define([
	'scripts/app',
	'DocteurCreditJS',
	'scripts/models/Financementbeta.js'
	], function (app,DC) {
	app.factory('Refinancing', function (Financement){
		/**
		 * [Refinancing description]
		 * @param {[type]} capital   [description]
		 * @param {[type]} rate      [description]
		 * @param {[type]} duration  [description]
		 * @param {[type]} date      [description]
		 * @param {[type]} newDate   [description]
		 * @param {[type]} newRate   [description]
		 * @param {[type]} rateTable [description]
		 */
		function Refinancing(capital, rate, duration, date, newDate, newRate, rateTable){
			//console.log(new Financement(capital, rate, duration, date));
			this.initMortgage = new Financement(capital, rate, duration, date);
			this.rate = rate;
			this.date = date;
			this.newDate = newDate;
			this.knowSRD = 'no';
			this.externalRef = false;
			this.duration = duration;
			this.init();
			this.fileCharges = 330;
			this.refMortgage = new Financement(this.capital, newRate, this.durationLeft, newDate);
			this.refMortgage.rateTable = [];
			this.generateRateTable(rateTable);
			this.generateTypeTable(rateTable);
			this.refMortgage.rateTable[0]=newRate;
			this.initMortgage.totalPaymentIfRef = this.initMortgage.getTotalFromPeriode(this.durationLeft);
			this.initMortgage.totalCapitalIfRef = this.initMortgage.getTotalCapitalFromPeriode(this.durationLeft);
			this.initMortgage.totalInterestIfRef = this.initMortgage.getTotalInterestFromPeriode(this.durationLeft);
			this.refMortgage.totalPaymentInitMortgage = this.initMortgage.totalPaymentIfRef;
			this.update();

			

		}

		Refinancing.prototype = {

			/**
			 * [update description]
			 * @param  {[type]} ref           [description]
			 * @param  {[type]} duration      [description]
			 * @param  {[type]} durationFirst [description]
			 * @return {[type]}               [description]
			 */
			update: function (ref,  duration, durationFirst) {
				this.durationLeft = this.getDurationLeft(this.date, this.newDate);
				this.initMortgage.durationLeft = this.durationLeft;
				
				if (!ref) {
					this.initMortgage.update();
				};
				this.date = this.initMortgage.date;
				this.newDate = new Date(this.refMortgage.formatDate(this.refMortgage.dateString));
				this.init();
				this.refMortgage.capital = this.capital;
				this.refMortgage.newRefInd = this.refMortgage.refInd;
				if(!duration){
					this.refMortgage.duration = this.durationLeft;
				}
				this.refMortgage.durationLeft = this.refMortgage.duration;
				
				this.validateData(durationFirst);
				this.initMortgage.totalPaymentIfRef = this.initMortgage.getTotalFromPeriode(this.durationLeft);
				this.initMortgage.totalCapitalIfRef = this.initMortgage.getTotalCapitalFromPeriode(this.durationLeft);
				this.initMortgage.totalInterestIfRef = this.initMortgage.getTotalInterestFromPeriode(this.durationLeft);
				this.refMortgage.totalPaymentInitMortgage = this.initMortgage.totalPaymentIfRef;
			},

			/**
			 * [init description]
			 * @return {[type]} [description]
			 */
			init : function () {
				this.durationLeft = this.getDurationLeft(this.date, this.newDate);
				this.SRD = this.getSRD();
				this.indem = this.getIndem(this.rate);
				this.capital = this.indem+this.SRD+this.fileCharges;
				if(this.externalRef){
					var fraisCredit = DC.FraisCreditFactory.getFraisCredit(1);
					this.releaseCharges = DC.FraisMainLevee.getFraisMainLevee(this.SRD);
					this.capital+=this.releaseCharges;
					var capital = fraisCredit.getMontantBrut(this.capital);
					this.MGRegistration = capital - this.capital;
					this.capital = capital;
				}
			},

			/**
			 * [validateData description]
			 * @param  {[type]} durationFirst [description]
			 * @return {[type]}               [description]
			 */
			validateData : function (durationFirst) {
				var found = false;
				var linePosition;
				if(this.refMortgage.sameMonthlyPayement){
					this.refMortgage.monthlyPayment = this.initMortgage.monthlyPayment;
					this.refMortgage.setDuration();
				}
				this.checkDuration();
				if (this.refMortgage.type.localeCompare('fixe')===0) {
					var i =0;
					while(!found && i<5) {
						if(this.refMortgage.duration>=this.rateTable[i].duration_min && this.refMortgage.duration<=this.rateTable[i].duration_max  ){
							found = true;
							linePosition = i;
						}
						i++;
					}

				}else{
					var tmpLine = -1;
					var i =5;
					if(durationFirst){
						while(!found && i<11) {
							if(this.refMortgage.duration>=this.rateTable[i].duration_min && this.refMortgage.duration<=this.rateTable[i].duration_max  ){
								 tmpLine = tmpLine<0 ? i : tmpLine;
								var split = this.refMortgage.type.split(' ');
								if(split[0].localeCompare(this.rateTable[i].type)==0){
									linePosition = i;
									found = true;
								}else{
									linePosition = tmpLine;
								}
							}

							i++;
						};
						if(!found){
							this.refMortgage.type = this.rateTable[linePosition].type+" (+"+this.rateTable[linePosition].cap_pos+'/-'+this.rateTable[linePosition].cap_neg+') de '+Math.floor(this.rateTable[linePosition].duration_min/12)+'ans à '+Math.floor(this.rateTable[linePosition].duration_max/12)+'ans';
							this.refMortgage.setCap();
						}
					}else{
						this.refMortgage.setCap();
						var split = this.refMortgage.type.split(' ');
						var tmpline = -1;
						while(!found && i<11) {
							if(split[0].localeCompare(this.rateTable[i].type)==0){
								tmpline = tmpline<0 ? i : tmpline;
								if(this.refMortgage.duration>=this.rateTable[i].duration_min && this.refMortgage.duration<=this.rateTable[i].duration_max  ){
									linePosition = i;
									found = true;
								}else{
									linePosition = tmpline;
								}
								
							}
							i++;
						}

						if(!found){
							this.refMortgage.sameMonthlyPayement = false;
							this.refMortgage.duration=this.rateTable[linePosition].duration_min;
						}
						this.checkDuration();

						
					}
				}
				if(this.rateTable[linePosition].quotLess.homeSafeOne.indexOf(this.refMortgage.initRate)== -1 && 
					this.rateTable[linePosition].quotLess.homeSafeTwo.indexOf(this.refMortgage.initRate)== -1 && 
					this.rateTable[linePosition].quotLess.homeSafeThree.indexOf(this.refMortgage.initRate)== -1 && 
					this.rateTable[linePosition].quotPlus.homeSafeOne.indexOf(this.refMortgage.initRate)== -1 && 
					this.rateTable[linePosition].quotPlus.homeSafeTwo.indexOf(this.refMortgage.initRate)== -1 && 
					this.rateTable[linePosition].quotPlus.homeSafeThree.indexOf(this.refMortgage.initRate)== -1 &&
					this.refMortgage.initRate !== this.rateTable[linePosition].rate){
						this.refMortgage.initRate = this.rateTable[linePosition].rate;
						this.refMortgage.rateTable = [];
						this.refMortgage.rateTable[0] = this.rateTable[linePosition].rate;
						this.refMortgage.rateTable = this.refMortgage.rateTable.concat(
							this.rateTable[linePosition].quotLess.homeSafeOne, 
							this.rateTable[linePosition].quotLess.homeSafeTwo, 
							this.rateTable[linePosition].quotLess.homeSafeThree, 
							this.rateTable[linePosition].quotPlus.homeSafeOne, 
							this.rateTable[linePosition].quotPlus.homeSafeTwo, 
							this.rateTable[linePosition].quotPlus.homeSafeThree 
							);
						
						
				}  
				this.refMortgage.update();
				
					// se dplacer dans la ligne du tableau en fonction des donnee.
					// une fois deplacer, verifier chaque donnée, si une est different, on lui donne la valeur par defaut de cette ligne
					// ne pas changer de colone
			},
			checkDuration : function  (argument) {
				if(this.refMortgage.duration<72 ){
					this.refMortgage.duration=72;
				}else{
					if(this.refMortgage.duration>360 ){
						this.refMortgage.duration=360;
					}
				}
			},

			/**
			 * [getDurationLeft description]
			 * @param  {[type]} date    [description]
			 * @param  {[type]} newDate [description]
			 * @return {[type]}         [description]
			 */
			getDurationLeft : function (date, newDate) {
				var month = (newDate.getFullYear() - date.getFullYear())*12;
				month-= (date.getMonth() - newDate.getMonth());
				return this.initMortgage.duration-month;
			},

			/**
			 * [getSRD description]
			 * @return {[type]} [description]
			 */
			getSRD : function(){
				var period = this.initMortgage.duration - this.durationLeft;
				return this.initMortgage.amortization[period-1].SRD;
			},

			/**
			 * [getIndem description]
			 * @param  {[type]} rate [description]
			 * @return {[type]}      [description]
			 */
			getIndem : function (rate){
				rate = Math.round((Math.pow(1 + (rate/100), 1 / 12) - 1)*1000000)/1000000;
				 return this.SRD*rate*3;
			},
			/**
			 * [getNewCapital description]
			 * @return {[type]} [description]
			 */
			getNewCapital : function(){
				return this.indem+this.SRD+this.fileCharges;
			},

			/**
			 * [generateTypeTable description]
			 * @param  {[type]} rateTable [description]
			 * @return {[type]}           [description]
			 */
			generateTypeTable : function (rateTable) {
				// body...
				this.refMortgage.typeTable = ['fixe'];
				var j = 1;
				for (var i = 5; i < rateTable.length; i++) {
					this.refMortgage.typeTable[j] = rateTable[i].type+" (+"+rateTable[i].cap_pos+'/-'+rateTable[i].cap_neg+') de '+Math.floor(rateTable[i].duration_min/12)+'ans à '+Math.floor(rateTable[i].duration_max/12)+'ans';
					j++;
				};
			},

			/**
			 * [generateRateTable description]
			 * @param  {[type]} rateTable [description]
			 * @return {[type]}           [description]
			 */
			generateRateTable : function (rateTable) {
				var quot = {};
				this.rateTable = [];
				//console.log(rateTable);
				for (var i = 0; i < rateTable.length; i++) {
					this.rateTable[i]= {};
					this.rateTable[i].id = parseInt(rateTable[i].id);
					this.rateTable[i].cap_neg = parseInt(rateTable[i].cap_neg);
					this.rateTable[i].cap_pos = parseInt(rateTable[i].cap_pos);
					this.rateTable[i].duration_max = parseInt(rateTable[i].duration_max);
					this.rateTable[i].duration_min = parseInt(rateTable[i].duration_min);
					this.rateTable[i].type = (rateTable[i].type);
					rateTable[i].rate = parseInt(parseFloat(rateTable[i].rate)*100);
					this.rateTable[i].rate = (rateTable[i].rate)/100;
					this.rateTable[i].quotPlus = {};		
					this.rateTable[i].quotLess = {};
					this.rateTable[i].quotLess.homeSafeOne = 	[(rateTable[i].rate - (095 ))/100,(rateTable[i].rate - (145 ))/100,(rateTable[i].rate - (165 ))/100];	
					this.rateTable[i].quotLess.homeSafeTwo = 	[(rateTable[i].rate - (125 ))/100,(rateTable[i].rate - (175 ))/100,(rateTable[i].rate - (195 ))/100];
					this.rateTable[i].quotLess.homeSafeThree = 	[(rateTable[i].rate - (150 ))/100,(rateTable[i].rate - (200 ))/100,(rateTable[i].rate - (220 ))/100];
					this.rateTable[i].quotPlus.homeSafeOne = 	[(rateTable[i].rate - (060 ))/100,(rateTable[i].rate - (110 ))/100,(rateTable[i].rate - (130 ))/100];	
					this.rateTable[i].quotPlus.homeSafeTwo = 	[(rateTable[i].rate - (100 ))/100,(rateTable[i].rate - (150 ))/100,(rateTable[i].rate - (200 ))/100];
					this.rateTable[i].quotPlus.homeSafeThree = 	[(rateTable[i].rate - (125 ))/100,(rateTable[i].rate - (175 ))/100,(rateTable[i].rate - (195 ))/100];
				};



			}



		};

		return Refinancing;

	});
});
