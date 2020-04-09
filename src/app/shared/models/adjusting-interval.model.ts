export class AdjustingInterval {
  private running;

  private expected;
  private timeout;

  private interval;
  private workFunc;
  private errorFunc;

  constructor(workFunc, interval, errorFunc?) {
    this.interval = interval;
    this.workFunc = workFunc;
    this.errorFunc = errorFunc;
  }

  start() {
      this.expected = Date.now() + this.interval;
      this.timeout = setTimeout(this.step.bind(this), this.interval);
      this.running = true;
  }

  stop() {
    clearTimeout(this.timeout);
    this.running = false;
  }

  step() {
    var drift = Date.now() - this.expected;
    if (drift > this.interval) {
        // You could have some default stuff here too...
        if(this.errorFunc) 
          this.errorFunc();
    }
    
    this.workFunc();
    
    if(this.running) {
      this.expected += this.interval;
      this.timeout = setTimeout(this.step.bind(this), Math.max(0, this.interval - drift));
    }
  }
}