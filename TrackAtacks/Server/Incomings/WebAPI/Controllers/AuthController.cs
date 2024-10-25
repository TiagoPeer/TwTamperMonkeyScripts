using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebAPI.DTOs.Auth;

namespace WebAPI.Controllers;

[ApiController]
[Route("[controller]")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost]
    public IActionResult Login(LoginRequestDTO request)
    {
        // Perform authentication logic (validate credentials, etc.)
        var isUsernamePasswordValid = request.Username == "Tiago" && request.Password == "123";

        if (isUsernamePasswordValid)
        {
            string token = CreateToken(request.Username);

            var responseMessage = new HttpResponseMessage()
            {
                StatusCode = HttpStatusCode.OK
            };

            //return the token
            return Ok(new { token, responseMessage });
        }

        return BadRequest("Username or Password Invalid!");
    }

    private string CreateToken(string username)
    {

        List<Claim> claims = new()
            {                    
                //list of Claims - we only checking username - more claims can be added.
                new Claim("username", Convert.ToString(username)),
            };

        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration.GetSection("Jwt:Token").Value));
        var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: cred,
            issuer: null,
            audience: null
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return jwt;
    }

}