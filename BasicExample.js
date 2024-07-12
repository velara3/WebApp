import { BaseClass } from "./BaseClass";
export class ExampleApp extends BaseClass {
    message = "hello world";
    constructor() {
        super();
    }
    async start() {
        try {
            this.log(this.message);
        }
        catch (error) {
            this.log(error);
        }
    }
    setupEventListeners() {
        try {
            window.addEventListener("click", () => {
                this.showAlert(this.message);
            });
        }
        catch (error) {
            this.log(error);
        }
    }
    showAlert(value) {
        alert(value);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzaWNFeGFtcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQmFzaWNFeGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFeEMsTUFBTSxPQUFPLFVBQVcsU0FBUSxTQUFTO0lBQ3RDLE9BQU8sR0FBVyxhQUFhLENBQUE7SUFFL0I7UUFDRyxLQUFLLEVBQUUsQ0FBQztJQUNYLENBQUM7SUFFUSxLQUFLLENBQUMsS0FBSztRQUVqQixJQUFJLENBQUM7WUFDRixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQixDQUFDO1FBQ0QsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkIsQ0FBQztJQUNKLENBQUM7SUFFUSxtQkFBbUI7UUFDekIsSUFBSSxDQUFDO1lBQ0YsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQy9CLENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQztRQUNELE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDWixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25CLENBQUM7SUFDSixDQUFDO0lBRUQsU0FBUyxDQUFDLEtBQWE7UUFDcEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hCLENBQUM7Q0FDSCJ9