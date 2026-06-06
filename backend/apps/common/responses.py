from rest_framework.response import Response


def api_response(data=None, message="", status=None):
    return Response(
        {
            "success": True,
            "message": message,
            "data": data if data is not None else {},
        },
        status=status,
    )
