define([
	'scripts/app',
	'DocteurCreditJS',
	'scripts/models/Financementbeta.js'
	], function (app,DC) {
	app.factory('Refinancing', function (Financement){

		function Refinancing(capital, rate, duration, date, newDate =  new Date(), newRate=0){
			//console.log(new Financement(capital, rate, duration, date));
			this.initMortgage = new Financement(capital, rate, duration, date);
			this.rate = rate;
			this.date = date;
			this.newDate = newDate;
			this.knowSRD = 'yes';
			
			this.init();
			this.fileCharges = 330;
			this.refMortgage = new Financement(this.capital, newRate, this.durationLeft, newDate);
			this.initMortgage.totalPaymentIfRef = this.initMortgage.getTotalFromPeriode(this.durationLeft);
			this.initMortgage.totalCapitalIfRef = this.initMortgage.getTotalCapitalFromPeriode(this.durationLeft);
			this.initMortgage.totalInterestIfRef = this.initMortgage.getTotalInterestFromPeriode(this.durationLeft);
			this.update();

			

		}

		Refinancing.prototype = {


			update: function (ref,  duration, sameMonthlyPayement = false) {
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
			},
			init : function () {
				this.durationLeft = this.getDurationLeft(this.date, this.newDate);
				this.SRD = this.getSRD();
				this.indem = this.getIndem(this.rate);
				this.capital = this.getNewCapital();
				this.initMortgage.totalPaymentIfRef = this.initMortgage.getTotalFromPeriode(this.durationLeft);
				this.initMortgage.totalCapitalIfRef = this.initMortgage.getTotalCapitalFromPeriode(this.durationLeft);
				this.initMortgage.totalInterestIfRef = this.initMortgage.getTotalInterestFromPeriode(this.durationLeft);
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
			}


		};

		return Refinancing;

	});
});
