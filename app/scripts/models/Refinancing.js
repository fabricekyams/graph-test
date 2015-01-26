define([
	'scripts/app',
	'DocteurCreditJS',
	'scripts/models/Financementbeta.js'
	], function (app,DC) {
	app.factory('Refinancing', function (Financement){

		function Refinancing(capital, rate, duration, date, newDate, newRate, rateTable){
			//console.log(new Financement(capital, rate, duration, date));
			this.generateRateTable(rateTable);
			this.initMortgage = new Financement(capital, rate, duration, date);
			this.rate = rate;
			this.date = date;
			this.newDate = newDate;
			this.knowSRD = 'no';
			this.duration = duration;
			this.init();
			this.fileCharges = 330;
			this.refMortgage = new Financement(this.capital, newRate, this.durationLeft, newDate);
			this.initMortgage.totalPaymentIfRef = this.initMortgage.getTotalFromPeriode(this.durationLeft);
			this.initMortgage.totalCapitalIfRef = this.initMortgage.getTotalCapitalFromPeriode(this.durationLeft);
			this.initMortgage.totalInterestIfRef = this.initMortgage.getTotalInterestFromPeriode(this.durationLeft);
			this.refMortgage.totalPaymentInitMortgage = this.initMortgage.totalPaymentIfRef;
			this.update();

			

		}

		Refinancing.prototype = {


			update: function (ref,  duration, sameMonthlyPayement) {
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

				if(sameMonthlyPayement){
					this.refMortgage.update(this.initMortgage.monthlyPayment);
				}else{

					this.refMortgage.update();
				}
				this.initMortgage.totalPaymentIfRef = this.initMortgage.getTotalFromPeriode(this.durationLeft);
				this.initMortgage.totalCapitalIfRef = this.initMortgage.getTotalCapitalFromPeriode(this.durationLeft);
				this.initMortgage.totalInterestIfRef = this.initMortgage.getTotalInterestFromPeriode(this.durationLeft);
				this.refMortgage.totalPaymentInitMortgage = this.initMortgage.totalPaymentIfRef;
			},
			init : function () {
				this.durationLeft = this.getDurationLeft(this.date, this.newDate);
				this.SRD = this.getSRD();
				this.indem = this.getIndem(this.rate);
				this.capital = this.getNewCapital();
				this.validateData();
			},
			validateData : function (argument) {
					// se dplacer dans la ligne du tableau en fonction des donnee.
					// une fois deplacer, verifier chaque donnée, si une est different, on lui donne la valeur par defaut de cette ligne
					// ne pas changer de colone
			},

			getDurationLeft : function (date, newDate) {
				var month = (newDate.getFullYear() - date.getFullYear())*12;
				month-= (date.getMonth() - newDate.getMonth());
				return this.initMortgage.duration-month;
			},

			getSRD : function(){
				var period = this.initMortgage.duration - this.durationLeft;
				return this.initMortgage.amortization[period-1].SRD;
			},

			getIndem : function (rate){
				rate = Math.round((Math.pow(1 + (rate/100), 1 / 12) - 1)*1000000)/1000000;
				 return this.SRD*rate*3;
			},
			getNewCapital : function(){
				return this.indem+this.SRD+this.fileCharges;
			},
			generateRateTable : function () {
				// body...
			},
			generateRateTable : function (rateTable) {
				var quot = {};
				/*this.rateTable = rateTable;
				for (var i = 0; i < rateTable.length; i++) {
					this.rateTable[i].quotPlus = {};		
					this.rateTable[i].quotLess = {};
					this.rateTable[i].quotLess.homeSafeOne = [rateTable[i].rate - 0.95,rateTable[i].rate - 1.45 ,rateTable[i].rate -  1.65];	
					this.rateTable[i].quotLess.homeSafeTwo = [rateTable[i].rate - 1.25,rateTable[i].rate - 1.75,rateTable[i].rate - 1.95];
					this.rateTable[i].quotLess.homeSafeThree = [rateTable[i].rate - 1.50 ,rateTable[i].rate - 2,rateTable[i].rate - 2.20];
					this.rateTable[i].quotPlus.homeSafeOne = [rateTable[i].rate - 0.6,rateTable[i].rate - 1.10 , rateTable[i].rate - 1.30];	
					this.rateTable[i].quotPlus.homeSafeTwo = [rateTable[i].rate - 1 ,rateTable[i].rate - 1.50 ,rateTable[i].rate - 2];
					this.rateTable[i].quotPlus.homeSafeThree = [rateTable[i].rate - 1.25 ,rateTable[i].rate  - 1.75,rateTable[i].rate - 1.95];
				};
				console.log(this.rateTable);*/



                //console.log(rates);
			}



		};

		return Refinancing;

	});
});
