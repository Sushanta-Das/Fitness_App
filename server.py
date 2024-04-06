from flask import Flask, request, jsonify
from edit_sql.mysql_cursor import cursor,mydb
from edit_sql.users_sign_up_in import users_sign_up_in
remote_users_sign_up_in=users_sign_up_in(mydb,'user_table2',jsonify)
app = Flask(__name__)

@app.route('/')
def welcome():
	return jsonify("Welcome to fitness world"), 200

@app.route('/users', methods=['GET'])
def get_users():  
    return remote_users_sign_up_in.get_all_users()
    
@app.route('/sign_up', methods=['POST'])
def sign_up():
    return remote_users_sign_up_in.sign_up(data=request.json)

@app.route('/sign_in', methods=['POST'])
def sign_in():
    data = request.json
    print(data)
    query = """SELECT * FROM user_table2 WHERE email = %s AND password = %s  """;
    try:
        try:email,password=data['email'],data['password']
        except:return jsonify({'error': 'Invalid input.'}), 400
        cursor.execute(query,(email,password))
        res=cursor.fetchall()
        return jsonify(res), 200
    except ValueError:
        return jsonify({'error': 'Invalid attempt'}), 400
@app.route('/test')
def test():
    x=test1()
    return jsonify(x),200

if __name__ == '__main__':
	app.run()
