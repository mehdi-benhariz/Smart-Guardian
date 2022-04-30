import requests

base_url = 'https://smartguardian.herokuapp.com/'


def validate_QR_code(CIN, token):
    # try catch
    try:
        response = requests.post(base_url, data={'CIN': CIN, 'token': token})
        return response.json()
    except:
        print('Error')
        pass
