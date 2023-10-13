class MousePosition {
  private static instance: MousePosition;
  private x = 0;
  private y = 0;

  private constructor() {
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  public static getInstance(): MousePosition {
    if (!MousePosition.instance) {
      MousePosition.instance = new MousePosition();
    }

    return MousePosition.instance;
  }

  private handleMouseMove = (event: MouseEvent) => {
    this.x = event.clientX;
    this.y = event.clientY;
  };

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }
}

export default MousePosition.getInstance();
