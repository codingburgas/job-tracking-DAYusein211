using Look.API.DTOs;

namespace Look.API.Services;

public interface IAuthService
{
    Task<AuthResponseDTO?> RegisterAsync(RegisterDTO registerDto);
    Task<AuthResponseDTO?> LoginAsync(LoginDTO loginDto);
}