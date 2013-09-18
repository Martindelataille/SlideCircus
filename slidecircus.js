/*
 * SlideCircus 1.0
 * Author: Martin de la Taille
 *
  * Copyright 2012
   * Free to use and abuse under the MIT license.
   * http://www.opensource.org/licenses/mit-license.php
 */

/*
 *Params :
 *	@id
 *	@stopOnFocus
 *	@timeOut
*/

var SlideShow = {
	construct: function(parent) {

		/* Slider object */
		var Slider = function(obj) {
			this.imgArr = document.getElementById(obj.id).getElementsByTagName('img');
			this.imgLen = this.imgArr.length;

			this.mainElement = obj.id;
			this.count = 0;

			this.timeout = obj.timeOut ? ( obj.timeOut * 1000) : 5000;
			this.stopOnFocus = obj.stopOnFocus ? obj.stopOnFocus : true;

			return this;
		}

		Slider.prototype.next = function(element){
			this.count ++;
			return this.count = (this.count % this.imgLen);
		}

		Slider.prototype.prev = function(element){
			if(this.count <= 0)
				return this.count = this.imgLen - 1;

			this.count --;
			return this.count = (this.count % this.imgLen);
		}

		var element = new Slider(parent);

		// init all mouse action and display control
		this._action.init(element);

		// Start SlideShow
		return SlideShow._utils.change(element);
	},
	_utils: {
		change: function(element, action) {
			SlideShow._utils.hide(element);

			if(action === "prev"){
				element.prev();
			} else if (action === "next") {
				element.next();
			} else if(parseInt(action) == action) {
				element.count = action;
			}

			SlideShow._utils.show(element);
			// Launch timer to go next slide
			SlideShow._utils.timer(element, "next");
		},
		hide: function(element) {
			element.imgArr[element.count].className = 'hide';
			document.getElementById(element.count).className = '';
			SlideShow._utils.hideDesc(element);
		},
		show: function(element){
			element.imgArr[element.count].className = 'show';
			document.getElementById(element.count).className = 'active';
		},
		timer: function(element, action){
			if(typeof this.cloackTimer !== "undefined") {
				// Destroy current timer if it exist
				clearTimeout(this.cloackTimer);
			}
			if(action !== "stop"){
				this.cloackTimer = setTimeout(function(){
					SlideShow._utils.change(element, action);
				}, element.timeout)
			}
		},
		showDesc: function(element){
			var parent = element.imgArr[element.count].parentNode;
				var child = parent.getElementsByTagName("span");
				if(typeof child[0] !== "undefined"){
					child[0].className = 'show';
				}
		},
		hideDesc: function(element){
			var parent = element.imgArr[element.count].parentNode;
				var child = parent.getElementsByTagName("span");
				if(typeof child[0] !== "undefined"){
					child[0].className = 'hide';
				}
		}
	},
	_action : {
		hoverSlide: function(element){
			var  item = document.getElementById(element.mainElement);

			if(item.attachEvent){ // if ie7/ie8
				item.attachEvent("onmouseover", function(){
					SlideShow._utils.timer(element, "stop");
					SlideShow._utils.showDesc(element);
				});

				item.attachEvent("onmouseout", function(){
					SlideShow._utils.change(element);
					SlideShow._utils.hideDesc(element);
				});
			} else if (item.addEventListener) {
				item.addEventListener("mouseover", function(){
					SlideShow._utils.timer(element, "stop");
					SlideShow._utils.showDesc(element);
				}, false);

				item.addEventListener("mouseout", function(){
					SlideShow._utils.change(element);
					SlideShow._utils.hideDesc(element);
				}, false);
			}
		},
		displayCtrl: function(element){
			// display control
			var i,
				nav = document.getElementById('control'),
				html = '';

			for (i = 0; i < element.imgLen; i++) {
				html += '<a href="#" id="' + i + '"></a>';
			}

			nav.innerHTML = html;
		},
		navigate: function(element) {
			// init control over all links
			var links = document.getElementById(element.mainElement).getElementsByTagName('a'),
				len = links.length,
				i;

			var changeSlide = function(){
				var e = window.event.srcElement;
				var action = e.id;
				SlideShow._utils.change(element, action);
			}

			for (i = 0; i < len; i++) {
				var a = links[i];
				if(a.attachEvent){ /* if ie7/ie8 */
					a.attachEvent('onclick',changeSlide)
				} else if(a.addEventListener) {
					a.addEventListener('click',changeSlide, false)
				}
			}
		},
		init: function(element) {
			this.displayCtrl(element);
			this.navigate(element);
			if(element.stopOnFocus)
				this.hoverSlide(element);
		}
	},
	init: function(obj) {
		if(typeof obj !== "undefined" && document.getElementById(obj.id) !== null) {
			SlideShow.construct(obj);
		} else {
			alert("no dom element selected")
		}
	}
}
