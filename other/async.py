import asyncio,time

# async def my_async_function(x):
#     print("Async function started ",x)
#     await asyncio.sleep(x)  # Simulate some asynchronous operation
#     # time.sleep(x)
#     print("Async function completed ",x)
#     # return x

# async def main():
#     print("Main function started")
#     await my_async_function(5)  # Calling the asynchronous function
#     await my_async_function(6)  # Calling the asynchronous function
#     print("Main function completed")

# # Run the main function asynchronously
# asyncio.run(main())

async def fun(diff):
    x=time.time()
    
    while int(time.time()-x) <diff:
        print("Fun ",diff)
        await asyncio.sleep(1)

    print("\n\n\t\tEnd ",diff)
    return diff*diff

async def main():
    # t1=asyncio.create_task(fun1())
    # # await fun1()
    # await fun2()
    # await fun3()
    l=await asyncio.gather(
        fun(4),
        fun(7),
        fun(3),
        fun(5),

    )
    print(l)
asyncio.run(main())