using Microsoft.AspNetCore.Mvc;
using Look.API.DTOs;
using Look.API.Services;

namespace Look.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDTO registerDto)
    {
        var result = await _authService.RegisterAsync(registerDto);
        
        if (result == null)
            return BadRequest(new { message = "Username already exists" });

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
    {
        var result = await _authService.LoginAsync(loginDto);
        
        if (result == null)
            return Unauthorized(new { message = "Invalid username or password" });

        return Ok(result);
    }
}