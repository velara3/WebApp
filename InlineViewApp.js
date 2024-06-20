import { BaseClass } from "./BaseClass.js";
window.addEventListener("DOMContentLoaded", () => { new HomeClass(); });
class UserView {
    userLabel = document.getElementById("userLabel");
    userIcon = document.getElementById("userIcon");
}
var userView = new UserView();
export class HomeClass extends BaseClass {
    constructor() {
        super();
        try {
            this.bindProperties(HomeClass);
            this.contentLoaded();
        }
        catch (error) {
            this.log(error);
        }
    }
    async contentLoaded() {
        this.bindProperties(HomeClass);
        this.getUser();
    }
    async getUser() {
        try {
            var data = await this.requestURL("user");
            this.setContent(userView.userLabel, data.user);
        }
        catch (error) {
            this.log(error);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5saW5lVmlld0FwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIklubGluZVZpZXdBcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTNDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxHQUFFLEVBQUUsR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFFckUsTUFBTSxRQUFRO0lBQ1gsU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFnQixDQUFDO0lBQ2hFLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBZ0IsQ0FBQztDQUNoRTtBQUVELElBQUksUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7QUFFOUIsTUFBTSxPQUFPLFNBQVUsU0FBUSxTQUFTO0lBRXJDO1FBQ0csS0FBSyxFQUFFLENBQUM7UUFFUixJQUFJLENBQUM7WUFDRixJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN4QixDQUFDO1FBQ0QsT0FBTSxLQUFLLEVBQUUsQ0FBQztZQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkIsQ0FBQztJQUNKLENBQUM7SUFFUSxLQUFLLENBQUMsYUFBYTtRQUN6QixJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU87UUFDVixJQUFJLENBQUM7WUFDRixJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBQ0QsT0FBTSxLQUFLLEVBQUUsQ0FBQztZQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkIsQ0FBQztJQUNKLENBQUM7Q0FDSCJ9