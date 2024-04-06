class users_sign_up_in:
    def __init__(self,mydb,table,lib_jsonify) -> None:
        self.mydb,self.cursor,self.table,self.jsonify=mydb,mydb.cursor(),table,lib_jsonify
    def get_user(self,user_id):
        self.cursor.execute(f"select * from {self.table}")
    def get_all_users(self):
        try:
            self.cursor.execute(f"select * from {self.table}")
            res=self.cursor.fetchall()
            return self.jsonify(res), 200
        except ValueError:
            return self.jsonify({'error': f'Invalid table {self.table}'}), 400
        
    def sign_up(self,data):
        try:
            val = (
                    data['email'],data['password'],data['name'],data['gender'],data['age'],data['height'], data['weight'],data['state'], data['task_choice'],data['goal_points'],data['current_points'],data['course'])
            self.cursor.execute(f"""select count(*) from {self.table} where email=%s""",(data['email'],)) 
            exist=self.cursor.fetchone()[0]
            if exist is not None and exist >0: # 409 unique email conflict
                return self.jsonify({'error': 'The provided email already exists. Please try signing in instead.'}), 409
        except KeyError as e:
            print(e) 
            return self.jsonify({'error': 'Invalid entry for table.'}), 400
        try:
            query = f"""INSERT INTO {self.table} (email, password, name, gender, age, height, weight, state, task_choice, goal_points,current_points,course)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

            print(val)
            self.cursor.execute(query,val)
            self.mydb.commit()
            return self.jsonify("sucess"), 200
        except ValueError:
            return self.jsonify({'error': 'Data not saved'}), 400