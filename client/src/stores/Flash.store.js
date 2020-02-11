import { observable, action } from "mobx";

class FlashStore {
  // Properties
  @observable items = [];

  //Actions
  @action createFlash(type = "Success", message) {
    const newFlash = {
      id: Math.random(),
      type,
      message,
      visible: true
    };
    this.items.push(newFlash);
    setTimeout(() => {
      this.items.find(flash => flash.id === newFlash.id).visible = false;
    }, 5000);
  }
}

const store = new FlashStore();
export default store;
