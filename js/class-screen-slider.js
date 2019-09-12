class ScreenSlider {
  constructor(wrapperID, videoTop = false, videoBottom = false) {
    /**
     * Initialize elements
     */
    this.wrapperID = wrapperID;
    this.videoTopParam = videoTop;
    this.videoBottomParam = videoBottom;
    this.wrapper = document.getElementById(this.wrapperID);
    this.slider = this.wrapper.querySelector(".slider");
    this.handle = this.wrapper.querySelector(".handle");
    this.topLayer = this.wrapper.querySelector(".top");
    this.bottomContainer = this.wrapper.querySelector(".bottom .content-wrap");
    this.topContainer = this.wrapper.querySelector(".top .content-wrap");
    this.closeIcon = this.wrapper.querySelector(".top i");
    this.videoBottomElem = this.wrapper.querySelector(".bottom video");
    this.videoTopElem = this.wrapper.querySelector(".top video");
    this.skew = 0;
    this.sliderPosition;
    this.status = "closed";

    if (this.wrapper.firstElementChild.classList.contains("skewed") === true) {
      this.skew = 1000;
    }

    /**
     * Event listeners for mouse and touch actions
     */

    this.handle.addEventListener("mousedown", event => {
      event.preventDefault();
      // Remove CSS animation class from slider and top layer
      this.removeAnimation();
      //Remove the drag event listener

      document.addEventListener("mouseup", this.onDragEndHandler);
      document.addEventListener("mousemove", this.onDragHandler);
      this.handle.addEventListener("dragstart", event =>
        event.preventDefault()
      );
    });

    this.handle.addEventListener("touchstart", event => {
      event.preventDefault();
      // Remove CSS animation class from slider and top layer
      this.removeAnimation();

      document.addEventListener("touchend", this.onDragEndHandler);
      document.addEventListener("touchmove", this.onDragHandler);
    });

    this.handle.addEventListener("click", event => {
      event.preventDefault();
      // Remove CSS animation class from slider and top layer
      this.removeAnimation();

      this.completeSlide(event);
    });

    this.handle.addEventListener("touchstart", event => {
      event.preventDefault();
      // Remove CSS animation class from slider and top layer
      this.removeAnimation();

      this.completeSlide(event);
    });

    /**
     * Add events when the close icon is clicked or tapped
     */
    this.closeIcon.addEventListener("click", event => {
      event.preventDefault();
      this.resetSlider(event);
    });

    this.closeIcon.addEventListener("touchstart", event => {
      event.preventDefault();
      this.resetSlider(event);
    });

    /**
     * Functions to handle the slider.
     * drag - handles when the element is beign dragged
     * dragEnd- when the dragging stops
     */

    this.drag = function(event) {
      this.updateOpacity(event);
      if (event.type === "touchmove") {
        this.slider.style.left = event.touches[0].clientX + "px";
        this.topLayer.style.width = event.touches[0].clientX + this.skew + "px";
      } else {
        this.slider.style.left = event.clientX + "px";
        this.topLayer.style.width = event.clientX + this.skew + "px";
      }
    };

    this.dragEnd = function(event) {
      this.completeSlide(event);
      document.removeEventListener("mouseup", this.onDragEndHandler);
      document.removeEventListener("mousemove", this.onDragHandler);

      document.removeEventListener("touchend", this.onDragEndHandler);
      document.removeEventListener("touchmove", this.onDragHandler);
    };

    /**
     * Handlers - The reference of the functions sent to the eventListeners
     * is stored in a property to be used later on in the removeEventListeners
     */
    this.onDragEndHandler = this.dragEnd.bind(this);
    this.onDragHandler = this.drag.bind(this);
  }

  eventListeners() {}

  checkInsideViewPort() {
    let handleBoundaries = this.handle.getBoundingClientRect();
    console.log(event);
    console.log(event.x, event.y);
    console.log(handleBoundaries.left, handleBoundaries.right);
    if (
      handleBoundaries.left >= 0 &&
      handleBoundaries.right <=
        (window.innerWidth || document.documentElement.clientWidth)
    ) {
      return true; //Inside the viewport
    } else if (handleBoundaries.left <= 0) return "left";
    else if (
      handleBoundaries.right <=
      (window.innerWidth || document.documentElement.clientWidth)
    ) {
      return "rigth";
    }
  }

  removeAnimation() {
    this.slider.classList.remove("slider-animation");
    this.topLayer.classList.remove("top-layer-animation");
  }

  addAnimation() {
    this.slider.classList.add("slider-animation");
    this.topLayer.classList.add("top-layer-animation");
  }

  updateOpacity(event) {
    let positionX = event.pageX;
    let windowWidth = window.innerWidth;
    let deltaBottom;

    deltaBottom = (windowWidth - positionX) / windowWidth;
    this.bottomContainer.style.opacity = deltaBottom;
    this.topContainer.style.opacity = 1 - deltaBottom;
  }

  completeSlide(event) {
    let initialPosition = event.pageX;
    let currentPosition = initialPosition;

    //Update bottom layer opacity
    this.bottomContainer.style.opacity = 1;
    // Hide handle
    this.updateHandle("hide");
    let movement = setInterval(() => {
      // When the position is lower than 0 then stop the animation
      if (currentPosition < 0) {
        clearInterval(movement);
        this.sliderPosition = currentPosition;
        this.updateCloseIcon("show");
        if (this.videoBottomParam === true) {
          this.playPauseVideo("bottom");
        }
        this.status = "open";
      } else {
        currentPosition = currentPosition - 10;
        this.slider.style.left = currentPosition + "px";
        this.topLayer.style.width = currentPosition + this.skew + "px";
      }
    }, 0.000000001);
  }

  updateCloseIcon(action) {
    if (action === "show") {
      this.closeIcon.classList.remove("hidden");
    } else {
      this.closeIcon.classList.add("hidden");
    }
  }

  updateHandle(action) {
    if (action === "show") {
      this.handle.classList.remove("hidden");
    } else {
      this.handle.classList.add("hidden");
    }
  }

  resetSlider() {
    let currentPosition = this.sliderPosition;
    let movement = setInterval(() => {
      // When the position is greater than the 70% of the viewport the stop the animation
      if (currentPosition / window.innerWidth > 0.7) {
        clearInterval(movement);
        this.updateCloseIcon("hide");
        this.updateHandle("show");
        this.topContainer.style.opacity = 1;
        this.bottomContainer.style.opacity = 0.5;
        if (this.videoBottomParam === true) {
          this.playPauseVideo("bottom");
        }
      } else {
        currentPosition = currentPosition + 10;
        this.slider.style.left = currentPosition + "px";
        this.topLayer.style.width = currentPosition + this.skew + "px";
      }
    }, 0.000000001);
  }

  playPauseVideo(videoLocation) {
    if (videoLocation === "bottom") {
      if (this.videoBottomElem.paused) {
        this.videoBottomElem.play();
      } else this.videoBottomElem.pause();
    } else {
      if (this.videoTopElem.paused) this.videoTopElem.play();
      else this.videoTopElem.pause();
    }
  }
}
