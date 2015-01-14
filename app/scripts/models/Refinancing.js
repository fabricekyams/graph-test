define([
	'scripts/app',
	'DocteurCreditJS',
	'scripts/models/financementbeta.js'
	], function (app,DC) {
	app.factory('Refinancing', function (Financement){

		function Refinancing(capital, rate, duration, date, newDate =  new Date(), newRate=0){
			//console.log(new Financement(capital, rate, duration, date));
			this.initMortgage = new Financement(capital, rate, duration, date);
			var durationLeft = this.getDurationLeft(date, newDate);
			var newCapital = this.getSRD(durationLeft);
			this.refMortgage = new Financement(newCapital, newRate, durationLeft, newDate);
			console.log(newCapital);

		}

		Refinancing.prototype = {


			update: function () {
				this.initMortgage.update();
				this.refMortgage.update();
			},

			getDurationLeft : function (date, newDate) {
				var month = (newDate.getFullYear() - date.getFullYear())*12;
				month-= (date.getMonth() - newDate.getMonth());
				return this.initMortgage.duration-month;
			},

			getSRD : function(durationLeft){
				var period = this.initMortgage.duration - durationLeft;
				return this.initMortgage.amortization[period-1].SRD;
			}


		};

		return Refinancing;

	});
});
