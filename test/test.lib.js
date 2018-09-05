var expect = chai.expect;
// test ultilites
function timeout(caller, fn, delay){
	delay = delay || 500;

	setTimeout(function(){
		fn.call(caller);
	}, delay);
}

function normal_test(pot){
	describe('Form#' + pot.form.id, function(){
		describe('installation', function(){
			it('should generate a starting time', function(){
				expect(pot.createdAt).to.exist;
			});

			it('should find out a placeholder', function(){
				expect($(pot.holder).hasClass('honeyjs')).to.be.ok;
			});

			it('should install a hidden empty input into placeholder', function(){
				var input = pot.empty;
				expect(input).to.exist;
				expect($(input).is(':visible')).to.not.be.ok;
				expect(input.value).to.be.empty;
			});

			it('should install a hidden time input into placeholder', function(){
				expect(pot.time instanceof HTMLInputElement).to.be.ok;
				expect($(pot.time).is(':visible')).to.not.be.ok;
			});

			if(!honey.config('key')){
				it('shouldn not contain a captcha key - no global key set-up', function(){
					expect(pot.re.required()).to.be.false;
				});
			}
			else{
				it('should contain a captcha key - global key set-up', function(){
					expect(pot.re.key).not.to.be.null;
				});
			}
		});

		describe('the pot after being installed', function(){
			this.timeout(20000);

			it('should accept submiting at current form state', function(){
				expect(pot.valid()).to.be.true;
			});

			it('should generate a time value everytimes form submited', function(){
				expect(pot.time.value).to.be.not.null;
			});

			it('should react when form is submited too fast', function(){
				expect(pot.fast(pot.createdAt + 2)).to.be.true;
				expect(pot.fast()).to.be.false;
			});

			it('should react when bot auto-filling', function(){
				pot.empty.value = 'haha';
				expect(pot.valid()).to.be.false;
			});

			it('should trigger validating hook everytimes form submited', function(done){
				pot.validate(function(){
					done();
				});
				pot.valid();
				pot.hooks.validate.flush();
			});

			it('should trigger failing hook everytimes form failed', function(done){
				pot.fail(function(){
					done();
				});
				pot.valid();
				pot.hooks.fail.flush();
			});

			after(function(){
				pot.empty.value = '';
			});
		});

		//console.log(honey.config('key'));

		if(!honey.config('key')){
			describe('the pot which has been installed a captcha key manually', function(){
				this.timeout(20000);

				before(function(){
					pot.captcha('6LewvA8TAAAAANSyW98_cLJJ1C3vJQqKhhgvx74_');
				});

				it('should contain a captcha key', function(){
					expect(pot.re.required()).to.be.true;
				});

				it('should have an empty holder for captcha to be rendered into', function(done){
					expect(pot.re.ready()).to.be.false;
					pot.empty.value = 'haha';
					pot.fail(done, 700);
					pot.valid();
					pot.hooks.fail.flush();
				});

				it('should trigger reCaptcha at the first time form failed', function(done){
					pot.validate(function(){
						return false;
					});

					function fn(){
						timeout(this, function(){
							expect(this.re.ready()).to.be.true;
							done();
						});
					}

					pot.fail(fn);
					pot.valid();
					pot.hooks.fail.flush();
					pot.hooks.validate.flush();
				});

				it('should prevent by-passing reCaptcha', function(){
					pot.empty.value = '';
					expect(pot.valid()).to.be.false;
				});

				after(function(){
					pot.hooks.validate.flush();
					pot.hooks.fail.flush();
				});
			});
		}
		else{
			describe('the pot which has been installed reCaptcha key automatically', function(){
				this.timeout(20000);

				it('should contain a captcha key same as global key', function(){
					expect(pot.re.key === honey.config('key')).to.be.true;
				});

				it('should have reCaptcha rendered', function(){
					expect(pot.re.ready()).to.be.true;
				});

				it('should prevent by-passing reCaptcha', function(){
					pot.empty.value = '';
					expect(pot.valid()).to.be.false;
				});

				after(function(){
					pot.hooks.validate.flush();
					pot.hooks.fail.flush();
				});
			});
		}
	});
}

function force_test(param){
	var pot = honey(param);

	describe("Form#" + pot.form.id, function(){
		this.timeout(5000);

		it('should have a sitekey installed', function(){
			expect(pot.re.required()).to.be.true;
		});

		it('should have reCaptcha required even when the form is not submited', function(done){
			timeout(pot, function(){
				expect(this.re.ready()).to.be.true;
				done();
			})
		});
	});
}

function share_config_test(pots){
	describe('Pot collection share configurations', function(){
		it('should reflect the same configurations when use method `config` on collection', function(){
			pots.config({theme : 'dark', type : 'audio'});
			expect(pots[0].options.theme).to.equal(pots[1].options.theme);
			expect(pots[0].options.type).to.equal(pots[1].options.type);
		});

		it('should reflect the same hooks when use method `validate` on collection', function(){
			var fn = function(){};
			pots.validate(fn);
			expect(pots[0].hooks.validate.has(fn)).to.be.true;
			expect(pots[1].hooks.validate.has(fn)).to.be.true;
		});

		it('should reflect the same hooks when use method `fail` on collection', function(){
			var fn = function(){};
			pots.fail(fn);
			expect(pots[0].hooks.fail.has(fn)).to.be.true;
			expect(pots[1].hooks.fail.has(fn)).to.be.true;
		});
	});
}

function expanded_cov_test(){
	describe('dependencies:', function(){
		if(honey.dev){
			it('should be tested', function(){
				expect(honey.dev.isDev()).to.be.true;
			});

			describe('ultilities:', function(){
				describe('now', function(){
					it('should return valid timestamp', function(){
						var t = honey.dev.now();
						expect(t).to.be.above(0);
						Date.now = null;
						var t = honey.dev.now();
						expect(t).to.be.above(0);
					});
				});

				describe('getHolder', function(){
					it('should return right placeholder of a form', function(){
						var form = $("#1")[0], holder = honey.dev.getHolder(form, 'honeyjs');

						expect($('#1').find(holder)).to.not.equal(-1);
						expect($(holder).hasClass('honeyjs')).to.be.true;

						var cantBeFound = honey.dev.getHolder(form, 'cantbefound');

						expect(cantBeFound).to.equal(form);
					});

					it('should perform right even in old browsers', function(){
						var form = document.createElement('form'),
							holder = document.createElement('div');

						holder.className = 'honeyjs yeah';
						form.appendChild(holder);
						form.getElementsByClassName = null;

						expect(form.getElementsByClassName).to.not.exist;

						expect(honey.dev.getHolder(form, 'honeyjs')).to.equal(holder);

						var cantBeFound = honey.dev.getHolder(form, 'cantbefound');
						expect(cantBeFound).to.equal(form);
					});
				});

				describe('find', function(){
					it('should return right index of element', function(){
						expect(honey.dev.find(3, [1, 3])).to.be.equal(1);
					});

					it('should return -1 if not found', function(){
						expect(honey.dev.find(0, [1, 3])).to.be.equal(-1);
					});

					it('should perform right even in old browsers', function(){
						var arr = [1, 3];
						arr.indexOf = null;
						expect(arr.indexOf).to.not.exist;
						expect(honey.dev.find(3, arr)).to.be.equal(1);
						expect(honey.dev.find(0, arr)).to.be.equal(-1);
					});
				});

				describe('hiddenInput', function(){
					it('should create a hidden input with provided name', function(){
						var input = honey.dev.hiddenInput($('#1')[0], '_test');

						expect(input.name).to.equal('_test');
						expect($(input).is(':visible')).to.be.false;
						expect($('#1').find(input)).not.to.equal(-1);
					});
				});

				describe('getInputByName', function(){
					it('should get a input inside form by name', function(){
						var input = honey.dev.getInputByName($('#1')[0], '_test');
						expect(input).instanceof(HTMLInputElement);
						expect(input.name).to.equal('_test');
						expect($('#1').find(input)).not.to.equal(-1);
					});
				});

				describe('contains', function(){
					it('should detect an element inside a collection', function(){
						expect(honey.dev.contains(3, [1, 3])).to.be.true;
						expect(honey.dev.contains(0, [1, 3])).to.be.false;
					});
				});

				describe('getForms', function(){
					it('should return a collection of all forms inside document', function(){
						expect(honey.dev.getForms()).to.equal(document.getElementsByTagName('form'));
					});
				});

				describe('installReCaptchaCallbacks', function(){
					it('should perform well', function(){
						var pot = new honey.dev.Pot(document.createElement('form'));
						var options = {};
						options = honey.dev.installReCaptchaCallbacks(pot.re, options);
						options.callback('daa');
						options["expired-callback"]();

						expect(options.callback).to.be.not.null;
						expect(options['expired-callback']).to.be.not.null;
					});
				});

				describe('activateReCaptchaAutomatically', function(){
					it('should perform well', function(done){
						var pot = new honey.dev.Pot(document.createElement('form'));
						var fn = honey.dev.activateReCaptchaAutomatically(pot);
						fn();
						done();
					});
				});

				describe('bind', function(){
					it('should bind an submit event handler to form and inject pot instance into handler', function(done){
						var form = document.createElement('form'),
							pot = new honey.dev.Pot(form),
							fn = honey.dev.bind(form, 'submit', function(){
								expect(this).to.equal(pot);
								done();
								return false;
							}, pot);

						fn({});
					});

					it('should work on other events', function(done){
						var link = document.createElement('a');

						var fn = honey.dev.bind(link, 'click', function(e){
							//expect(this).to.equal(window);
							done();
						}, {});

						fn({});
					});

					it('should perform in old browsers', function(done){
						var link = document.createElement('a');

						ev2 = link.addEventListener;
						link.attachEvent = ev2;
						link.addEventListener = null;

						var fn = honey.dev.bind(link, 'click', function(e){
							//expect(this).to.equal(window);
							return false;
						}, {});

						fn({});

						var form = document.createElement('form');
						// simulate IE7-
						var ev = form.addEventListener;
						form.attachEvent = ev;
						form.addEventListener = null;

						expect(form.addEventListener).to.not.exist;

						var pot = new honey.dev.Pot(form),

						fn = honey.dev.bind(form, 'submit', function(){
							expect(this).to.equal(pot);
							done();
							return false;
						}, pot);

						fn({});
					});
				});

				describe('cancel', function(){
					it('should cancel an event', function(){
						expect(honey.dev.cancel({
							preventDefault : function(){},
							stopPropagation : function(){}
						})).to.be.false;
					});
				});

				describe('installjQueryPlugin', function(){
					it('should install a jQuery plugin on demand and return false if installation failed', function(){
						var ret = honey.dev.installjQueryPlugin(jQuery, 'tryHoney', function(){
							return true;
						});

						expect(ret).to.be.true;

						var ret2 = honey.dev.installjQueryPlugin(null, 'cantInstall', function(){
							return true;
						});

						expect(ret2).to.be.false;
					});
				});

				describe('__installDev', function(){
					it('should install dev environment for honeyjs', function(){
						var ret = honey.dev.__installDev(0);

						expect(ret).to.be.false;

						var ret2 = honey.dev.__installDev(1);

						expect(ret2).to.be.true;
					});
				});
			});

			describe('functions:', function(){
				describe('$-plugin', function(){
					it('should be coverable by honeyjs', function(){
						// create pot
						expect($('#3').honey()).to.exist;
						expect($('#3').honey('123')).to.exist;
						expect($('#3').honey({theme:'light'})).to.exist;
					});
				});

				describe('config', function(){
					it('can be set and get', function(){
						honey.config({'global' : false});
						expect(honey.config('global')).to.be.false;
					});
				});

				describe('requireCaptcha', function(){
					it('should set a global key', function(){
						honey.requireCaptcha('6LewvA8TAAAAANSyW98_cLJJ1C3vJQqKhhgvx74_');
						expect(honey.config('key')).to.equal('6LewvA8TAAAAANSyW98_cLJJ1C3vJQqKhhgvx74_');
					});
				});

				describe('forceCaptcha', function(){
					it('should set a global force reCaptcha option', function(){
						expect(honey.forceCaptcha('6LewvA8TAAAAANSyW98_cLJJ1C3vJQqKhhgvx74_')).to.be.true;
						honey.config({'forceCaptcha' : false});
					});
				});

				describe('all', function(){
					it('should secure all forms inside document', function(){
						var pots = honey.all();

						expect(pots.length).to.equal($('form').length);
					});
				});

				describe('$-selector', function(){
					it('should perform', function(){
						var pot = honey('#8');
						expect(pot.re).to.be.not.null;
					});

					it('should work with jQuery plugin', function(){
						var pot = $('#8').honey();
						expect(pot.re).to.be.not.null;
						pot = $('#8').honey('6LewvA8TAAAAANSyW98_cLJJ1C3vJQqKhhgvx74_');
						expect(pot.re).to.be.not.null;
					});
				});
			});


			describe('expanded_tests:', function(){
				describe('types:', function(){
					describe('Pot', function(){
						this.timeout(20000);

						var form = document.createElement('form');
						var input= document.createElement('input');
						document.body.appendChild(form);
						input.name = 'findMe';
						form.id = '10';
						form.style.display = 'none';
						form.appendChild(input);
						var pot;

						before(function(){
							honey.config({
								forceReCaptcha : false,
								key : null
							});

							pot = honey(form);
						});

						it('should have main input\'s name which can be set and retrieved', function(){
							expect(pot.name()).to.equal('name');
							expect(pot.name('hi')).to.equal('hi');
						});

						it('can find any of its own inputs by name', function(){
							expect(pot.input('findMe')).to.equal(input);
							expect(pot.value('findMe')).to.equal(input.value);
							expect(pot.value('cantFind')).to.be.undefined;
						});

						it('should have reCaptcha component that can be reset', function(){
							pot.re.key = '6LewvA8TAAAAANSyW98_cLJJ1C3vJQqKhhgvx74_';
							pot.re.id = 1;
							pot.re.reset();

							pot.re.holder = document.createElement('div')
							expect(pot.valid()).to.be.false;
						});

						it('should have required reCaptcha component be invalid if grecaptcha not defined', function(done){
							//expect(this.valid()).to.be.false;
							grecaptcha = undefined;
							timeout(pot, function(){
								expect(pot.valid()).to.be.false;
								done();
							}, 200);

							var newRecaptcha = new honey.dev.ReCaptcha();
							newRecaptcha.key = '1111';
							expect(newRecaptcha.valid()).to.be.false;
						});

						it('should use global key if not passed any key when call `captcha` ', function(){
							pot.captcha();
							expect(pot.re.key).to.equal(honey.config('key'));
						});

						it('can config hooks and options', function(){
							pot.validate(function(){
							})
							pot.fail(function(){
							});
							pot.config({
								key : '6LewvA8TAAAAANSyW98_cLJJ1C3vJQqKhhgvx74_'
							});
							expect(pot.config('key')).to.equal('6LewvA8TAAAAANSyW98_cLJJ1C3vJQqKhhgvx74_');
						})

						it('should be valid after meeting requirements without reCaptcha', function(){
							pot.re.key = null;
								pot.hooks.validate.flush();
								expect(pot.valid()).to.be.true;
						});
					});

					describe('Collector', function(){
						var a = new honey.dev.Collector();
						a.push('a');
						a.push('b');
						//console.log(a.length);

						it('should be an inheritor of Array', function(){
							expect(a.length).to.exist;
						});

						it('can remove an element', function(){
							var ret = a.remove('b');
							expect(ret).to.not.equal(-1);
							expect(a.length).to.equal(1);
							expect(a[0]).to.equal('a');
							ret = a.remove('c');
							expect(ret).to.not.equal(-1);
							expect(a.length).to.equal(1);
						});
					});

					describe('Pots', function(){
						it('should pass too', function(){
							var form1 = document.createElement('form'),
								form2 = document.createElement('form');

							honey.forceCaptcha('6LewvA8TAAAAANSyW98_cLJJ1C3vJQqKhhgvx74_');
							var pots = honey([form1, form2]);

							expect(pots.config('type')).to.equal('image');
							pots.captcha('6LewvA8TAAAAANSyW98_cLJJ1C3vJQqKhhgvx74_');
						});
					});
				});
			});
		}
		else{
			it('should not be supported for testing on browsers', function(){
				expect(navigator.plugins.length).to.be.above(0);
			});
		}
	});
}