import { Order } from "../src/classes/Order";
import { OrderService } from "../src/classes/OrderService";
import { OrderRepository } from "../src/interfaces/OrderRepository";
import { PaymentService } from "../src/interfaces/PaymentService";

describe("placeOrder test", () => {
  let orderRepository: jest.Mocked<OrderRepository>;
  let paymentService: jest.Mocked<PaymentService>;
  let orderService: OrderService;

  beforeEach(() => {
    orderRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    paymentService = {
      processPayment: jest.fn(),
    };
    orderService = new OrderService(orderRepository, paymentService);
  });

  it("placeOrder 1,", async () => {
    const order1 = new Order(1, 1_000_000);
    paymentService.processPayment.mockResolvedValue(true);

    const order1Result = await orderService.placeOrder(order1);
    expect(order1Result).toBe(true);
    expect(paymentService.processPayment).toHaveBeenCalledWith(order1.amount);
    expect(orderRepository.save).toHaveBeenCalledWith(order1);
  });

  it("placeOrder 2", async () => {
    const order2 = new Order(1, 2_000);
    paymentService.processPayment.mockResolvedValue(false);

    const order2Result = await orderService.placeOrder(order2);
    expect(order2Result).toBe(false);
    expect(paymentService.processPayment).toHaveBeenCalledWith(order2.amount);
    expect(orderRepository.save).not.toHaveBeenCalled();
  });
});
