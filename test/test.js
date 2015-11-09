(function($){
	'use strict';
	$(document).ready(function(){
		var expect = chai.expect;
		var pot = honey($("#1"));

		describe('A Pot', function(){
			it('should be configurable', function(){
				expect(pot.options).to.exist;
				expect(pot.options).to.not.be.empty;
				expect(pot.options.theme).to.be.string('light');
				pot.config({theme : 'dark'});
				expect(pot.options.theme).to.be.string('dark');
			});

			it('should contain hooks', function(){
				expect(pot.hooks).to.exist;
			});

			it('can control the hooks', function(){
				var fn = function(){
					alert('haha');
				};

				pot.validate(fn);
				expect(pot.hooks.validate.has(fn)).to.be.true;
				pot.hooks.validate.remove(fn);
				expect(pot.hooks.validate.has(fn)).to.be.false;
				pot.validate(fn);
				expect(pot.hooks.validate.length).to.equal(1);
				pot.hooks.validate.flush();
				expect(pot.hooks.validate.length).to.equal(0);
			});

			it('has well-performing hooks - validating hook return false test', function(){
				var fn = function(){
					return false;
				};
				pot.validate(fn);
				expect(pot.valid()).to.be.false;
				pot.hooks.validate.flush();
			});

			it('should contain a reCaptcha component', function(){
				expect(pot.re).to.exist;
			});
		});

		describe('Single Pot', function(){
			normal_test(pot);
		});

		describe('Pots without Captcha', function(){
			var pots = honey($(".2"));
			pots.each(function(el) {
				normal_test(el);
			});

			share_config_test(pots);
		});

		describe('Pots forced requiring reCaptcha', function(){
			before(function(){
				honey.requireCaptcha('6LewvA8TAAAAANSyW98_cLJJ1C3vJQqKhhgvx74_');
			});

			var pots = honey($(".3"));
			for(var i = 0, l = pots.length; i < l; i++){
				normal_test(pots[i]);
			}

			share_config_test(pots);
		});

		describe('A Pot forced to have reCaptcha activated', function(){
			this.timeout(20000);

			honey.forceCaptcha('6LewvA8TAAAAANSyW98_cLJJ1C3vJQqKhhgvx74_');

			force_test($("#6"));
		});

		describe('Pots forced to have reCaptcha activated', function(){
			this.timeout(20000);

			$(".5").each(function(i, e){
				force_test(e);
			});
		});

		expanded_cov_test();

		// For Blanket add coverage in our Mocha CLI tests (node environment),
		// we need to add this reporter
		if(navigator.plugins.length === 0 && typeof blanket !== 'undefined'){
			blanket.options("reporter", "../node_modules/grunt-mip/support/grunt-reporter.js");
		}

		mocha.run();
	});
})(jQuery);