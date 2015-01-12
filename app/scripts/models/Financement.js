define([
	'scripts/app',
	'DocteurCreditJS',
	], function (app,DC) {
	app.factory('Financement', function(){

		function Financement(capital, rate, duration, date, newDate =  new Date()){
			
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
				this.setAmortization();
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
				for (var i = 0; i < this.durationLeft; i++) {
					this.amortization[i]={};
					this.amortization[i].month=5;
					this.amortization[i].interest=5;
					this.amortization[i].capital=5;
					this.amortization[i].srd=5;
					this.amortization[i].monthlyPayment=5;
					this.amortization[i].payment=5;

				};
			},
			getYearsAmortization : function(){
				return 'ok';
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
