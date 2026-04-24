<?php

namespace App\Http\Requests\espace;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEspaceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nom'          => 'sometimes|string|max:255',
            'surface'      => 'sometimes|integer|min:1',
            'type'         => 'sometimes|string|max:100',
            'tarif_jour'   => 'sometimes|integer|min:0',
            'photo'        => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'equipements'  => 'nullable|array',
            'equipements.*' => 'exists:equipements,id',
        ];
    }
}
