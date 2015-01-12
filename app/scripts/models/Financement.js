define([
	'scripts/app',
	'DocteurCreditJS',
	], function (app,DC) {
	app.factory('Financement', function(){

		function Financement(capital, rate, duration, date, newDate){
			
			this.capital = capital;
			this.rate = Math.pow(1 + (rate/100), 1 / 12) - 1;
			this.duration = duration;
			this.date = date;
			this.monthlyPayment = 0;
			this.amortization = [];
			this.durationLeft = 0;
			this.newDate = newDate;
			this.SRD =0;
			this.type = 'fixe';
		}

		Financement.prototype = {
			/* body... */

			init : function () {
				this.setDurationLeft();
				this.setSRD();
				this.setMonthlyPayment();
				console.log('ok');// body...
			},

			setSRD : function(){
				var period = this.duration - this.durationLeft;
				this.SRD = DC.CreditUtil.calculCapital(this.rate, this.duration, period)*this.capital;
			},
			setMonthlyPayment : function(){
				this.monthlyPayment = DC.CreditUtil.calculMensualite(this.rate, this.durationLeft)*this.capital;
			},

			setAmortization : function () {
				console.log('ok');// body...
			},
			setDurationLeft : function () {
				var month = (this.newDate.getFullYear() - this.date.getFullYear())*12;
				month-= (this.date.getMonth() - this.newDate.getMonth());
				this.durationLeft = this.duration-month;; 
			},

			getDurationLeft : function () {
				return this.durationLeft(); 
			}

		};

		return Financement;

	});
});
