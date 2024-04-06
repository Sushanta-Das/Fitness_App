import socket
import customtkinter
import tkinter
import threading

SERVER_ADDRESS = ('192.168.0.120', 8000)

def connect_with_server():
    global client_socket 

    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect(SERVER_ADDRESS)

def open_sign_in_and_sign_up_window():
    global sign_in_and_sign_up_window

    sign_in_and_sign_up_window = customtkinter.CTk()
    sign_in_and_sign_up_window.geometry('500x300')
    sign_in_and_sign_up_window.title('Chat Application')

    sign_in_button = customtkinter.CTkButton(
        master=sign_in_and_sign_up_window,
        text='Sign in',
        command=open_sign_in_window
    )

    sign_in_button.pack(side=customtkinter.LEFT, anchor='e', padx=50)

    sign_up_button = customtkinter.CTkButton(
        master=sign_in_and_sign_up_window,
        text='Sign up',
        command=open_sign_up_window
    )

    sign_up_button.pack(side=customtkinter.LEFT, anchor='e', padx=50)

    sign_in_and_sign_up_window.mainloop()

def open_sign_in_window():
    global sign_in_window, sign_in_name, sign_in_password, number_of_sign_in_attempts

    sign_in_and_sign_up_window.destroy()
    number_of_sign_in_attempts = 0

    sign_in_window = customtkinter.CTk()
    sign_in_window.geometry('400x400')
    sign_in_window.title('Sign In Window')

    sign_in_name = customtkinter.CTkEntry(
        master=sign_in_window,
        width=250,
        placeholder_text='Enter your user name'
    )

    sign_in_name.pack(pady=50)

    sign_in_password = customtkinter.CTkEntry(
        master=sign_in_window,
        width=250,
        placeholder_text='Enter your Password'
    )

    sign_in_password.pack(pady=50)

    sign_in_button = customtkinter.CTkButton(
        master=sign_in_window,
        text='Sign in',
        command=verify
    )

    sign_in_button.pack(pady=50)

    client_socket.send('Sign in'.encode('utf-8'))

    sign_in_window.mainloop()

def open_sign_up_window():
    global sign_up_window, sign_up_name, sign_up_password

    sign_in_and_sign_up_window.destroy()

    sign_up_window = customtkinter.CTk()
    sign_up_window.geometry('400x400')
    sign_up_window.title('Sign Up Window')

    sign_up_name = customtkinter.CTkEntry(
        master=sign_up_window,
        width=250,
        placeholder_text='Enter your user name'
    )

    sign_up_name.pack(pady=50)

    sign_up_password = customtkinter.CTkEntry(
        master=sign_up_window,
        width=250,
        placeholder_text='Enter your Password'
    )

    sign_up_password.pack(pady=50)

    sign_up_button = customtkinter.CTkButton(
        master=sign_up_window,
        text='Sign up',
        command=register
    )

    sign_up_button.pack(pady=50)

    sign_up_window.mainloop()

def verify():
    global number_of_sign_in_attempts

    number_of_sign_in_attempts += 1

    name = sign_in_name.get()
    password = sign_in_password.get()

    client_socket.send(name.encode('utf-8'))
    client_socket.send(password.encode('utf-8'))

    print(name, password)
    
    verification_result = client_socket.recv(1024).decode('utf-8')

    print(verification_result)

    if(verification_result == 'Correct'):
        tkinter.messagebox.showinfo(message='Verification successful')
        sign_in_window.destroy()

        create_chat_window(name)

        threading.Thread(target=receive_messages).start()

        chat_window.mainloop()
    else:
        if(number_of_sign_in_attempts < 5):
            tkinter.messagebox.showerror(message='Incorrect user name or password\n\n     Try again')

            sign_in_name.delete(0, 'end')
            sign_in_password.delete(0, 'end')
        else:
            tkinter.messagebox.showerror(message='Incorrect user name or password\n\nToo many sign in attempts')
            sign_in_window.destroy()

def register():
    client_socket.send('Sign up'.encode('utf-8'))
    client_socket.send(sign_up_name.get().encode('utf-8'))
    client_socket.send(sign_up_password.get().encode('utf-8'))

    tkinter.messagebox.showinfo(message='Your account has been created successfully')

    sign_up_window.destroy()

def create_chat_window(client_name):
    global chat_window, private_chat_section, public_chat_section, type_message

    customtkinter.set_appearance_mode('dark')

    chat_window = customtkinter.CTk()

    screen_width = chat_window.winfo_screenwidth()
    screen_height = chat_window.winfo_screenheight()
    chat_window.geometry(f'{screen_width}x{screen_height}')

    chat_window.title('Chat Window')

    photo = customtkinter.CTkFrame(
        master=chat_window,
        width=screen_width*0.12,
        height=screen_width*0.12,
        corner_radius=screen_width*0.06,
        fg_color='white'
    )

    photo.place(relx=0.03, rely=0.04)

    user_name = customtkinter.CTkLabel(
        master=chat_window,
        width=screen_width*0.12,
        height=screen_height*0.07,
        fg_color='transparent',
        text=client_name,
        text_color='white',
        font=('velvatica', 25)
    )

    user_name.place(relx=0.03, rely=0.28)

    public_chat_section = customtkinter.CTkScrollableFrame(
        master=chat_window,
        width=screen_width*0.3,
        height=screen_height*0.6,
        fg_color='#32a89d',
        label_text='Public Chats',
        label_font=('velvatica', 25)
    )

    public_chat_section.place(relx=0.21, rely=0.04)

    private_chat_section = customtkinter.CTkScrollableFrame(
        master=chat_window,
        width=screen_width*0.3,
        height=screen_height*0.6,
        fg_color='#32a89d',
        label_text='Private Chats',
        label_font=('velvatica', 25)
    )

    private_chat_section.place(relx=0.6, rely=0.04)

    type_message = customtkinter.CTkTextbox(
        master=chat_window,
        width=screen_width*0.5,
        height=screen_height*0.07,
        fg_color='white',
        text_color='black',
        font=('velvatica', 20)
    )

    type_message.place(relx=0.25, rely=0.75)

    names_of_clients = client_socket.recv(1024).decode('utf-8')

    list_of_clients = names_of_clients.split()
    list_of_clients.append('All')

    send_to = customtkinter.CTkComboBox(
        master=chat_window,
        width=screen_width*0.1,
        height=screen_height*0.05,
        font=('velvatica', 25),
        values = list_of_clients,
        dropdown_font=('velvatica', 25),
        command=send_messages
    )

    send_to.place(relx=0.78, rely=0.75)

def send_messages(receiver_name):
    message = type_message.get(0.0, 'end')
    client_socket.send((receiver_name + ' ' + message).encode('utf-8'))

    if(receiver_name != 'All'):
        label = customtkinter.CTkLabel(
            master=private_chat_section,
            corner_radius=15,
            text=f'You (to {receiver_name})\n\n{message}',
            justify='left',
            fg_color='white',
            text_color='black',
            font=('velvatica', 20)
        )

        label.pack(anchor='ne', pady=15)
    else:
        label = customtkinter.CTkLabel(
            master=public_chat_section,
            corner_radius=15,
            text=f'You\n\n{message}',
            justify='left',
            fg_color='white',
            text_color='black',
            font=('velvatica', 20)
        )

        label.pack(anchor='ne', pady=15)

    type_message.delete(0.0, 'end')

def receive_messages():
    while(True):
        sender_name_and_message = client_socket.recv(1024).decode('utf-8')

        index_of_first_space = sender_name_and_message.find(' ')
        sender_name = sender_name_and_message[:index_of_first_space]

        index_of_second_space = sender_name_and_message.find(' ', index_of_first_space+1)
        public_or_private = sender_name_and_message[index_of_first_space+1 : index_of_second_space]

        message = sender_name_and_message[index_of_second_space+1:]

        if(public_or_private == 'Private'):
            label = customtkinter.CTkLabel(
                master=private_chat_section,
                corner_radius=15,
                text=f'{sender_name}\n\n{message}',
                justify='left',
                fg_color='white',
                text_color='black',
                font=('velvatica', 20),
            )

            label.pack(anchor='nw', pady=15)
        else:
            label = customtkinter.CTkLabel(
                master=public_chat_section,
                corner_radius=15,
                text=f'{sender_name}\n\n{message}',
                justify='left',
                fg_color='white',
                text_color='black',
                font=('velvatica', 20),
            )

            label.pack(anchor='nw', pady=15)

def main():
    connect_with_server()
    open_sign_in_and_sign_up_window()


main()