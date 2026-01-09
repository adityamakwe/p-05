# import json
# from django.http import JsonResponse
# from django.shortcuts import render, redirect
# from .BaseCtl import BaseCtl
# from ..service.UserService import UserService
# from ..utility.DataValidator import DataValidator

# class LoginCtl(BaseCtl):

#     def request_to_form(self, requestForm):
#         self.form['loginId'] = requestForm.get('loginId', '')
#         self.form['password'] = requestForm.get('password', '')

#     def input_validation(self):
#         super().input_validation()

#         inputError = self.form["inputError"]

#         if (DataValidator.isNull(self.form["loginId"])):
#             inputError["loginId"] = "Login ID is required"
#             self.form["error"] = True
#         else:
#             if (DataValidator.isemail(self.form['loginId'])):
#                 inputError['loginId'] = "Login Id must be email"
#                 self.form['error'] = True

#         if (DataValidator.isNull(self.form["password"])):
#             inputError["password"] = "Password is required"
#             self.form["error"] = True

#         return self.form["error"]

#     def auth(self, request, params={}):
#         # json_request = json.loads(request.body)
#         # ✅ Handle CORS preflight
#         if request.method == "OPTIONS":
#             return JsonResponse({}, status=200)

#         # ✅ Safe JSON parsing
#         try:
#             json_request = json.loads(request.body.decode("utf-8")) if request.body else {}
#         except json.JSONDecodeError:
#             return JsonResponse(
#                 {"success": False, "result": {"message": "Invalid JSON"}},
#                 status=400
#             )
#         self.request_to_form(json_request)
#         res = {"result":{},"success":True}
#         if (self.input_validation()):
#             res["success"] = False
#             res["result"]["inputerror"] = self.form["inputError"]
#         else:
#             user = self.get_service().authenticate(self.form)
#             if (user is None):
#                 res['success'] = False
#                 res["result"]["message"] = "Login ID & Password is Invalid"
#             else:
#                 res["result"]["data"] = user.to_json()
#         return JsonResponse(res)

#     def get_service(self):
#         return UserService()





import json
from django.http import JsonResponse
from django.db import OperationalError
from .BaseCtl import BaseCtl
from ..service.UserService import UserService
from ..utility.DataValidator import DataValidator


class LoginCtl(BaseCtl):

    def request_to_form(self, requestForm):
        self.form['loginId'] = requestForm.get('loginId', '')
        self.form['password'] = requestForm.get('password', '')

    def input_validation(self):
        super().input_validation()

        inputError = self.form["inputError"]

        if DataValidator.isNull(self.form["loginId"]):
            inputError["loginId"] = "Login ID is required"
            self.form["error"] = True
        else:
            if DataValidator.isemail(self.form['loginId']):
                inputError['loginId'] = "Login Id must be email"
                self.form['error'] = True

        if DataValidator.isNull(self.form["password"]):
            inputError["password"] = "Password is required"
            self.form["error"] = True

        return self.form["error"]

    def auth(self, request, params={}):

        # ✅ CORS Preflight
        if request.method == "OPTIONS":
            return JsonResponse({}, status=200)

        # ✅ Safe JSON parsing
        try:
            json_request = json.loads(request.body.decode("utf-8")) if request.body else {}
        except json.JSONDecodeError:
            return JsonResponse(
                {"success": False, "result": {"message": "Invalid JSON"}},
                status=400
            )

        self.request_to_form(json_request)

        res = {"result": {}, "success": True}

        # ✅ Input validation
        if self.input_validation():
            res["success"] = False
            res["result"]["inputerror"] = self.form["inputError"]

        else:
            try:
                # 🔥 This hits MySQL
                user = self.get_service().authenticate(self.form)

                if user is None:
                    res["success"] = False
                    res["result"]["message"] = "Login ID & Password is Invalid"
                else:
                    res["result"]["data"] = user.to_json()

            except OperationalError:
                # 🔴 Database is down
                return JsonResponse(
                    {
                        "success": False,
                        "result": {
                            "message": "Database server is not running. Please try again later."
                        }
                    },
                    status=500
                )

            except Exception as e:
                # 🔴 Any other unexpected error
                return JsonResponse(
                    {
                        "success": False,
                        "result": {
                            "message": "Internal server error",
                            "details": str(e)
                        }
                    },
                    status=500
                )

        return JsonResponse(res)

    def get_service(self):
        return UserService()
